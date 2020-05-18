var pool = require('./connectMysql');
var fs = require('fs');
var node = require('./node');

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
        var saveResults;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var  sql = {
                    community_id_community:community_id,
                    lessonplan_intro:lessonplanData.lessonplan_intro,
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
            saveResults = results;
            var insertid = results.insertId;
            if(insertid !== 0){
                return node.createNewNode(community_id,'教案基本資料','教案基本資料','lessonplan',member_id,member_name)
            }
        })
        .then(function(data){
            return saveResults;
        })
    },

    saveUnitandActivity: function(community_id,lessonplanData,member_id,member_name){
        var activityArray = JSON.parse(lessonplanData.lessonplan_activity_name);

        return Promise.all(
            activityArray.map(function(data){
                var activity_name,saveResults;
                return new Promise(function(resolve,reject){
                    pool.getConnection(function(err,connection){
                        if(err) throw err;
                        var saveaction = data.saveaction;
                        var baseid = data.baseid;
                        activity_name = data.name;
    
                        var sql = {
                            community_id_community:community_id,
                            lessonplan_unit_name:lessonplanData.lessonplan_unit_name,
                            lessonplan_activity_name:activity_name,
                            member_id_member:member_id,
                            member_name:member_name
                        }
    
                        //為新值，insert
                        if(saveaction == "new"){
                            if(err) throw err;
                            connection.query('INSERT INTO `lessonplan_activity_process` SET ?',sql,function(err,rows,fields){
                                if(err) throw err;
                                resolve(rows)
                                connection.release();
                            })
                        }
                        //舊值，擁有baseid，根據baseid進行update
                        else if(saveaction == "update"){
                            if(err) throw err;
                            connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `lessonplan_activity_process_id` = ?',[sql,baseid],function(err,rows,fields){
                                if(err) throw err;
                                resolve(rows)
                                connection.release();
                            })
                        }
                    })
                })
                .then(function(results){
                    saveResults = results;
                    var insertid = results.insertId;
                    if(insertid !== 0){
                        return node.createNewNode(community_id,activity_name,'活動與評量設計','activity',member_id,member_name)
                    }
                })
                .then(function(data){
                    return saveResults;
                })
            })
        )  
    },

    saveActivityFile: function(community_id,lessonplanData){
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
            return module.exports.saveFileData(community_id,fileData)
        })
        .then(function(results2){
            return fileResults
        })
    },

    //將檔案資料存入資料庫
    saveFileData: function(community_id,fileData){
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
            
                            var sql = {
                                community_id_community:community_id,
                                community_file_name:originalname,
                                community_file_type:filetype
                            }
            
                            connection.query('INSERT INTO `community_file` SET ?',sql,function(err,insertResults,fields){
                                if(err) return reject(err);
                                resolve(insertResults);
                                connection.release();
                            })
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
            saveResults = results;
            var insertid = results.insertId;
            var stage_name;
            if(insertid !== 0){

                switch(lessonplan_stage_type){
                    case "lessonplan_target":
                        stage_name = "課程學習目標";
                        break;
                    case "core_competency":
                        stage_name = "總綱核心素養";
                        break;
                    case "learning_focus":
                        stage_name = "學習重點";
                        break;
                    case "learning_issue":
                        stage_name = "議題融入";
                        break;
                    case "lessonplan_studentknowledge":
                        stage_name = "學生先備知識";
                        break;
                    case "lessonplan_resource":
                        stage_name = "教學資源及器材";
                        break;
                    case "lessonplan_design":
                        stage_name = "教學設計理念";
                        break;
                }

                return node.createNewNode(community_id,stage_name,stage_name,lessonplan_stage_type,member_id,member_name)
            }
        })
        .then(function(data){
            return saveResults;
        })
    },

    saveTwoWayTable: function(community_id,lessonplanData,member_id,member_name){
        var saveResults;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var lessonplan_twowaytable_type = lessonplanData.type;

                var sql = {
                    community_id_community:community_id,
                    lessonplan_twowaytable_type:lessonplan_twowaytable_type,
                    lessonplan_twowaytable_content:lessonplanData.content
                }

                connection.query('SELECT COUNT(`lessonplan_twowaytable_content`) AS COUNTNUM FROM `lessonplan_twowaytable` WHERE `community_id_community` =?  AND `lessonplan_twowaytable_type` =? ',[community_id,lessonplan_twowaytable_type],function(err,countResults,fields){
                    if(err) return reject(err);
    
                    var countNum = countResults[0].COUNTNUM;
                    
                    if(countNum == 1){
                        connection.query('UPDATE `lessonplan_twowaytable` SET ? WHERE `community_id_community` =?  AND `lessonplan_twowaytable_type` =? ',[sql,community_id,lessonplan_twowaytable_type],function(err,updateResults,fields){
                            if(err) return reject(err);
                            resolve(updateResults);
                            connection.release();
                        })
                    }
                    else{
                        connection.query('INSERT INTO `lessonplan_twowaytable` SET ?',sql,function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
                    }
                })
            })
        })
        .then(function(results){
            saveResults = results;
            var insertid = results.insertId;
            if(insertid !== 0){
                return node.createNewNode(community_id,'學習目標與活動對應表','學習目標,活動與評量設計','twowaytable',member_id,member_name)
            }
        })
        .then(function(data){
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
        .then(function(results){
            return node.createNewNode(community_id,"課程學習目標","課程學習目標",lessonplan_stage_type,member_id,member_name)
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
        .then(function(results){
            return module.exports.selectLessonplanTwoWayTable(community_id)
        })
        .then(function(tableresult){
            var twowaytable_content = tableresult[0].lessonplan_twowaytable_content;
            var content = JSON.parse(twowaytable_content)
            
            var newarray = [];

            //修改學習目標與活動對應表中有使用到的學習目標
            content.map(function(contentdata){
                var targetName = contentdata.targetName;
                var activityName = contentdata.activityName;

                updateData.map(function(updatedata){
                    var updateaction = updatedata.updateaction;
                    var olddata = updatedata.olddata;
                    var newdata = updatedata.newdata;
                    //當儲存動作為更新的才會動作
                    if(updateaction == "update"){
                        //與舊資料匹配的進行更新
                        if(targetName == olddata){
                            targetName = newdata;
                            newarray.push({targetName:targetName,activityName:activityName})
                        }
                    }
                })
            })
            updateResult = JSON.stringify(newarray);
            return module.exports.updateTwoWayTableContent(community_id,updateResult,'activity');
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

    updateTwoWayTableContent: function(community_id,tableContent,type){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `lessonplan_twowaytable` SET `lessonplan_twowaytable_content`= ? WHERE `community_id_community`=? AND `lessonplan_twowaytable_type` =?',[tableContent,community_id,type],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })

            })
            
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
                            lessonplan_activity_content: data.lessonplan_activity_content
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

                connection.query('SELECT `lessonplan_activity_process_id`,`lessonplan_activity_content` FROM `lessonplan_activity_process` WHERE `community_id_community` = ?',community_id,function(err,rows,fields){
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
                    var activityString = JSON.stringify(newContentArray);
                    activityArray.push({id:id,lessonplan_activity_content:activityString})
                }
            })

            var activityString = JSON.stringify(activityArray);

            return activityString
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
                connection.query('SELECT `lessonplan_activity_name` FROM `lessonplan_activity_process` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
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
    
    selectLessonplanTwoWayTable: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `lessonplan_twowaytable` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
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