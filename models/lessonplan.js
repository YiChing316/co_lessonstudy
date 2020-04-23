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
    },

    saveUnitandActivity: function(community_id,lessonplanData,member_id,member_name){
        var activityArray = JSON.parse(lessonplanData.lessonplan_activity_name);

        return Promise.all(
            activityArray.map(function(data){
                return new Promise(function(resolve,reject){
                    pool.getConnection(function(err,connection){
                        if(err) throw err;
                        var saveaction = data.saveaction;
                        var baseid = data.baseid;
                        var activity_name = data.name;
    
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
                
            })
        )  
    },

    saveActivityFile: function(community_id,lessonplanData){
        var lessonplan_activity_content = lessonplanData.lessonplan_activity_content;
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
                    if(fs.existsSync(assessment_tmp)){
                        fs.renameSync(assessment_tmp,newpath+assessment_originalname,function(err){
                            if (err) throw err;
                        })
                    }
                    newasessment_array.push({assessment_content:assessment_content,assessment_originalname:assessment_originalname,assessment_tmp:""}) 
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

    deletLessonplanActivityProcess: function(lessonplanData){

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
    }
}