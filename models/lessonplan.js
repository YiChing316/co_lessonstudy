var pool = require('./connectMysql');
var fs = require('fs');

module.exports = {

    //判斷此lessonplan是否已有儲存領域、版本、年級
    checklessonplandata: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                //select看社群成員表內是否此會員已在此社群中
                connection.query('SELECT * FROM `lessonplan` WHERE `community_id_community`=?',[community_id],function(err,rows,fields){
                    if(err) return reject(err);

                    if(rows.length){
                        resolve(rows);
                        connection.release();
                    }
                    else{
                        resolve({isExisted:false});
                        connection.release();
                    }
                })
            })
        })
    },

    saveLessonplan: function(community_id,lessonplanData,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var  sql = {
                    community_id_community:community_id,
                    lessonplan_intro:lessonplanData.lessonplan_intro,
                    lessonplan_unit_name:lessonplanData.lessonplan_unit_name,
                    lessonplan_field:lessonplanData.lessonplan_field,
                    lessonplan_version:lessonplanData.lessonplan_version,
                    lessonplan_grade:lessonplanData.lessonplan_grade,
                    lessonplan_time:lessonplanData.lessonplan_time,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('SELECT COUNT(`community_id_community`) AS COUNTNUM FROM `lessonplan` WHERE `community_id_community`=?',[community_id],function(err,countResults,fields){
                    if(err) return reject(err);
    
                    var countNum = countResults[0].COUNTNUM;
                    
                    if(countNum == 1){
                        connection.query('UPDATE `lessonplan` SET ? WHERE `community_id_community`=?',[sql,community_id],function(err,updateResults,fields){
                            if(err) return reject(err);
                            resolve(updateResults);
                            connection.release();
                        })
                    }
                    else{
                        connection.query('INSERT INTO `lessonplan` SET ?',sql,function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
                    }
                })
            })
        })
        .then(function(results){
            return results;
        })
    },

    insertActivity: function(community_id,lessonplanData,node_id,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var  sql = {
                    community_id_community:community_id,
                    lessonplan_activity_name:lessonplanData.lessonplan_activity_name,
                    lessonplan_activity_target:lessonplanData.tableContent,
                    node_id_node:node_id,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('INSERT INTO `lessonplan_activity_process` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
        .then(function(activitydata){
            var process_id = activitydata.insertId;
            return process_id
        })
    },

    updateActivity: function(community_id,lessonplanData,member_id,member_name){
        var tableContent = lessonplanData.tableContent;
        var baseid;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                baseid = lessonplanData.baseid;

                var  sql = {
                    community_id_community:community_id,
                    lessonplan_activity_name:lessonplanData.lessonplan_activity_name,
                    lessonplan_activity_target:tableContent,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `lessonplan_activity_process_id` = ?',[sql,baseid],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
        .then(function(activitydata){
            return module.exports.selecThisActivity(baseid)
        })
        .then(function(selectData){
            var processContent = selectData[0].	lessonplan_activity_content;
            if( processContent !== ""){
                var processArray = JSON.parse(processContent);
                var tableArray = tableContent.split(',');
                var updateArray = [];
                //新的活動content
                var newProcessArray = []
                processArray.map(function(processdata){
                    var learning_target = processdata.lessonplan_activity_learningtarget;
                    var lessonplan_activity_content = processdata.lessonplan_activity_content;
                    var lessonplan_activity_time = processdata.lessonplan_activity_time;
                    var lessonplan_activity_assessment = processdata.lessonplan_activity_assessment;
                    var lessonplan_activity_remark = processdata.lessonplan_activity_remark;

                    var newtargetarray = [];
                    var targetarray = learning_target.split(',');
                    tableArray.map(function(newtarget){
                        targetarray.map(function(targetname){
                            if(targetname == newtarget){
                                newtargetarray.push(targetname)
                            }
                        })
                    })
                    var newtargetstring = newtargetarray.toString();
                    newProcessArray.push({lessonplan_activity_learningtarget:newtargetstring,
                                            lessonplan_activity_content:lessonplan_activity_content,
                                            lessonplan_activity_time:lessonplan_activity_time,
                                            lessonplan_activity_assessment:lessonplan_activity_assessment,
                                            lessonplan_activity_remark:lessonplan_activity_remark
                                        })
                })
                var activityString = JSON.stringify(newProcessArray);
                updateArray.push({id:baseid,lessonplan_activity_content:activityString,lessonplan_activity_target:tableContent})
                var updateString = JSON.stringify(updateArray)
                return module.exports.updateActivityProcessContent(updateString)
            }
            else{
                return baseid
            }
        })
    },

    saveActivityFile: function(community_id,lessonplanData,member_id,member_name){
        var lessonplan_activity_content = lessonplanData.lessonplan_activity_content;
        var fileData = [];
        var fileResults;
        return new Promise(function(resolve,reject){
            lessonplan_activity_content = JSON.parse(lessonplan_activity_content);
            var newpath = './public/communityfolder/community_'+community_id+'/communityfile/';
            var newactivity_array =[];
            for(var i=0;i<lessonplan_activity_content.length;i++){
                var data = lessonplan_activity_content[i];
                var learningtarget = data.lessonplan_activity_learningtarget;
                var content = data.lessonplan_activity_content;
                var time = data.lessonplan_activity_time;
                var remark = data.lessonplan_activity_remark;
                var assessmentdata = data.lessonplan_activity_assessment;
                var newasessment_array = [];
                for(var s=0;s<assessmentdata.length;s++){
                    var assessment_content = assessmentdata[s].assessment_content;
                    var assessment_originalname = assessmentdata[s].assessment_originalname;
                    var assessment_tmp = assessmentdata[s].assessment_tmp;
                    var assessment_mimetype = assessmentdata[s].assessment_mimetype;
                    if(fs.existsSync(assessment_tmp)){
                        fs.renameSync(assessment_tmp,newpath+assessment_originalname,function(err){
                            if (err) throw err;
                        })
                    }
                    var assessment_data = {
                        assessment_content:assessment_content,
                        assessment_originalname:assessment_originalname,
                        assessment_tmp:"",
                        assessment_mimetype:assessment_mimetype
                    };
                    newasessment_array.push(assessment_data)
                    fileData.push(assessment_data)
                }
                newactivity_array.push({lessonplan_activity_learningtarget:learningtarget,
                                            lessonplan_activity_content:content,
                                            lessonplan_activity_time:time,
                                            lessonplan_activity_assessment:newasessment_array,
                                            lessonplan_activity_remark:remark
                                        })
            }
            var newString = JSON.stringify(newactivity_array);
            resolve(newString);
        })
        .then(function(results){
            fileResults = results;
            return module.exports.saveFileData(community_id,fileData,member_id,member_name)
        })
        .then(function(results2){
            return fileResults
        })
    },

    //將檔案資料存入資料庫
    saveFileData: function(community_id,fileData,member_id,member_name){
        if(fileData.length >0){
            return Promise.all(
                fileData.map(function(data){
                    return new Promise(function(resolve,reject){
                        pool.getConnection(function(err,connection){
                            if(err) return reject(err);
    
                            var originalname = data.assessment_originalname;
                            var filetype = data.assessment_mimetype;

                            switch(filetype){
                                case "image/png":
                                case "image/jpeg":
                                case "image/gif":
                                    filetype = "圖片"
                                    break;
                                default:
                                    filetype = "文件"
                                    break;
                            }

                            if(originalname !== ""){
                                var sql = {
                                    community_id_community:community_id,
                                    community_file_name:originalname,
                                    community_file_type:filetype,
                                    member_id_member:member_id,
                                    member_name:member_name
                                }

                                connection.query('SELECT * FROM `community_file` WHERE `community_id_community` = ? AND `community_file_name` = ?',[community_id,originalname],function(err,selectResults,fields){
                                    if(err) return reject(err);
                                    
                                    if(selectResults.length !== 1){
                                        connection.query('INSERT INTO `community_file` SET ?',sql,function(err,insertResults,fields){
                                            if(err) return reject(err);
                                            resolve(insertResults);
                                            connection.release();
                                        })
                                    }
                                    else resolve(fileData);
                                })
                            }
                            else{
                                resolve(fileData);
                            }
                        })
                    })
                })
            )
        }
        else{
            return fileData
        }
    },

    saveLessonplanActivityProcess: function(lessonplan_activity_process_id,lessonplan_activity_content,member_id,member_name){

        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                var sql = {
                    lessonplan_activity_content:lessonplan_activity_content,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `lessonplan_activity_process_id` = ?',[sql,lessonplan_activity_process_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    saveLessonplanprocessCustomModal: function(community_id,lessonplanData){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var  sql = {
                    community_id_community:community_id,
                    lessonplanprocess_custom_modal_content:lessonplanData.customContent
                }

                connection.query('SELECT `lessonplanprocess_custom_modal_content` FROM `lessonplanprocess_custom_modal` WHERE `community_id_community`=?',community_id,function(err,selectResults,fields){
                    if(err) return reject(err);

                    
                    if(selectResults.length == 1){
                        connection.query('UPDATE `lessonplanprocess_custom_modal` SET ? WHERE `community_id_community`=?',[sql,community_id],function(err,updateResults,fields){
                            if(err) return reject(err);
                            resolve(updateResults);
                            connection.release();
                        })
                    }
                    else{
                        connection.query('INSERT INTO `lessonplanprocess_custom_modal` SET ?',sql,function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
                    }
                })
            })
        })
    },

    saveLessonplanStage: function(community_id,lessonplanData,member_id,member_name){
        var lessonplan_stage_type,saveResults;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                lessonplan_stage_type = lessonplanData.lessonplan_stage_type;

                var sql = {
                    community_id_community:community_id,
                    lessonplan_stage_type:lessonplan_stage_type,
                    lessonplan_stage_content:lessonplanData.lessonplan_stage_content,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('SELECT COUNT(`lessonplan_stage_content`) AS COUNTNUM FROM `lessonplan_stage` WHERE `community_id_community` =?  AND `lessonplan_stage_type` =? ',[community_id,lessonplan_stage_type],function(err,countResults,fields){
                    if(err) return reject(err);
    
                    var countNum = countResults[0].COUNTNUM;
                    
                    if(countNum == 1){
                        connection.query('UPDATE `lessonplan_stage` SET ? WHERE `community_id_community` =?  AND `lessonplan_stage_type` =? ',[sql,community_id,lessonplan_stage_type],function(err,updateResults,fields){
                            if(err) return reject(err);
                            resolve(updateResults);
                            connection.release();
                        })
                    }
                    else{
                        connection.query('INSERT INTO `lessonplan_stage` SET ?',sql,function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
                    }
                })
            })
        })
        .then(function(results){
            return saveResults;
        })
    },

    insertLessonplanTarget: function(community_id,lessonplanData,member_id,member_name){
        var lessonplan_stage_type = lessonplanData.lessonplan_stage_type;

        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
            
                var sql = {
                    community_id_community:community_id,
                    lessonplan_stage_type:lessonplan_stage_type,
                    lessonplan_stage_content:lessonplanData.lessonplan_stage_content,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('INSERT INTO `lessonplan_stage` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
    },

    updateLessonplanTarget: function(community_id,lessonplanData,member_id,member_name){
        var target_update_data = lessonplanData.target_update_data;
        var updateData = JSON.parse(target_update_data);

        var updateResult;

        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                var lessonplan_stage_type = lessonplanData.lessonplan_stage_type;

                var sql = {
                    community_id_community:community_id,
                    lessonplan_stage_type:lessonplan_stage_type,
                    lessonplan_stage_content:lessonplanData.lessonplan_stage_content,
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('UPDATE `lessonplan_stage` SET ? WHERE `community_id_community` =?  AND `lessonplan_stage_type` =? ',[sql,community_id,lessonplan_stage_type],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })

            })
            
        })
        .then(function(data){
            return module.exports.changeActivityProcessContent(community_id,updateData)
        })
        .then(function(activitydata){
            return module.exports.updateActivityProcessContent(activitydata)
            // return updateResult;
        })
        .then(function(data){
            return updateResult;
        })
    },

    updateActivityProcessContent: function(activitydata){
        var activityArray = JSON.parse(activitydata);

        return Promise.all(
            activityArray.map(function(data){
                return new Promise(function(resolve,reject){
                    pool.getConnection(function(err,connection){
                        if(err) throw err;
                        var id = data.id;

                        var sql = {
                            lessonplan_activity_content: data.lessonplan_activity_content,
                            lessonplan_activity_target:data.lessonplan_activity_target
                        }
        
                        connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `lessonplan_activity_process_id` = ?',[sql,id],function(err,rows,fields){
                            if(err) return reject(err);
                            resolve(rows);
                            connection.release();
                        })
                    })
                })
            })
        )
    },

    changeActivityProcessContent: function(community_id,updateData){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('SELECT `lessonplan_activity_process_id`,`lessonplan_activity_content`,`lessonplan_activity_target` FROM `lessonplan_activity_process` WHERE `community_id_community` = ?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(selectdata){
            
            var activityArray = [];

            selectdata.map(function(data){
                
                var id = data.lessonplan_activity_process_id;
                var activity_content = data.lessonplan_activity_content;
                var activity_target = data.lessonplan_activity_target;

                var newActivityTarget = [];
                if(activity_target !== ""){
                    var activity_targetArray = activity_target.split(',');
                    activity_targetArray.map(function(origindata){
                        updateData.map(function(updatedata){
                            var updateaction = updatedata.updateaction;
                            var olddata = updatedata.olddata;
                            var newdata = updatedata.newdata;
                            //當儲存動作為更新的才會動作
                            if(updateaction == "update"){
                                //與舊資料匹配的進行更新
                                if(origindata == olddata){
                                    origindata = newdata;
                                    newActivityTarget.push(origindata)
                                }
                            }
                        })
                    })
                }
                var newActivityTargetString = newActivityTarget.toString();

                var contentString;
                if(activity_content !== ""){
                    //活動content處理為array
                    var contentArray = JSON.parse(activity_content);

                    //新的活動content
                    var newContentArray = []
                    contentArray.map(function(contentdata){
                        var learning_target = contentdata.lessonplan_activity_learningtarget;
                        var lessonplan_activity_content = contentdata.lessonplan_activity_content;
                        var lessonplan_activity_time = contentdata.lessonplan_activity_time;
                        var lessonplan_activity_assessment = contentdata.lessonplan_activity_assessment;
                        var lessonplan_activity_remark = contentdata.lessonplan_activity_remark;

                        var targetarray = learning_target.split(',');
                        var newarray = [];

                        targetarray.map(function(targetname){
                            updateData.map(function(updatedata){
                                var updateaction = updatedata.updateaction;
                                var olddata = updatedata.olddata;
                                var newdata = updatedata.newdata;
                                //當儲存動作為更新的才會動作
                                if(updateaction == "update"){
                                    //與舊資料匹配的進行更新
                                    if(targetname == olddata){
                                        targetname = newdata;
                                        newarray.push(targetname)
                                    }
                                }
                            })
                        })

                        var targetString = newarray.toString();

                        newContentArray.push({lessonplan_activity_learningtarget:targetString,
                                                lessonplan_activity_content:lessonplan_activity_content,
                                                lessonplan_activity_time:lessonplan_activity_time,
                                                lessonplan_activity_assessment:lessonplan_activity_assessment,
                                                lessonplan_activity_remark:lessonplan_activity_remark
                                            })
                    })
                    contentString = JSON.stringify(newContentArray);
                    // activityArray.push({id:id,lessonplan_activity_content:activityString})
                }

                activityArray.push({id:id,lessonplan_activity_content:contentString,lessonplan_activity_target:newActivityTargetString})
            })
            // console.log(activityArray)
            var activityString = JSON.stringify(activityArray);

            return activityString
        })
    },

    selecThisActivity: function(lessonplan_activity_process_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `lessonplan_activity_process` WHERE `lessonplan_activity_process_id`=?',lessonplan_activity_process_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },
    
    selectLessonplanActivityProcess: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `lessonplan_activity_process` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectLessonplanActivityName: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `lessonplan_activity_process_id`,`lessonplan_activity_name` FROM `lessonplan_activity_process` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },
    
    selectLessonplanStageData: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `lessonplan_stage` WHERE `community_id_community`=?',[community_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectLessonplanTarget: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `lessonplan_stage_content` FROM `lessonplan_stage` WHERE `community_id_community` = ? AND `lessonplan_stage_type` = "lessonplan_target"',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectLessonplanprocessCustomModal: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `lessonplanprocess_custom_modal_content` FROM `lessonplanprocess_custom_modal` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectActivityAllData: function(result){
        result = JSON.parse(result)
        var resultArray = [];
        return Promise.all(
            result.map(function(data){
                var originalId = data.originalId;
                var newId = data.newId;
                return new Promise(function(resolve,reject){
                    pool.getConnection(function(err,connection){
                        if(err) return reject(err);
                        connection.query('SELECT `lessonplan_activity_name`,`lessonplan_activity_content`,`lessonplan_activity_target`,`node_id_node`,`member_id_member`,`member_name` FROM `lessonplan_activity_process` WHERE `lessonplan_activity_process_id` = ?',newId,function(err,rows,fields){
                            if(err) return reject(err);
                            resolve(rows);
                            connection.release();
                        })
                    })
                })
                .then(function(selectdata){
                    resultArray.push({id:originalId,data:selectdata[0]})
                    return selectdata
                })
            })
        )
        .then(function(data){
            return resultArray
        })
    },

    updateNewOrderActivity: function(newArray,community_id){
        return Promise.all(
            newArray.map(function(val){
                var id = val.id;
                var data = val.data;
                return new Promise(function(resolve,reject){
                    pool.getConnection(function(err,connection){
                        if(err) return reject(err);
                        connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `community_id_community` =? AND `lessonplan_activity_process_id` = ?',[data,community_id,id],function(err,rows,fields){
                            if(err) return reject(err);
                            resolve(rows);
                            connection.release();
                        })
                    })
                })
            })
        )
        .then(function(data){
            return module.exports.selectLessonplanActivityProcess(community_id)
        })
    },

    deleteLessonplanActivityProcess: function(lessonplanData){

        var lessonplan_activity_process_id = lessonplanData.lessonplan_activity_process_id;
        var community_id = lessonplanData.community_id;

        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('DELETE FROM `lessonplan_activity_process` WHERE `lessonplan_activity_process_id` = ?',lessonplan_activity_process_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectLessonplanActivityProcess(community_id)
        })
    },

    deleteActivityFile: function(community_id,filename){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('DELETE FROM `community_file` WHERE `community_id_community` = ? AND `community_file_name` = ?',[community_id,filename],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}