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

    saveTwoWayTable: function(community_id,lessonplanData){
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