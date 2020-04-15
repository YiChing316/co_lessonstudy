var pool = require('./connectMysql');

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

    saveLessonplan: function(community_id,lessonplanData,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;

            var sql;
            sql = {
                community_id_community:community_id,
                lessonplan_intro:lessonplanData.lessonplan_intro,
                lessonplan_field:lessonplanData.lessonplan_field,
                lessonplan_version:lessonplanData.lessonplan_version,
                lessonplan_grade:lessonplanData.lessonplan_grade,
                lessonplan_time:lessonplanData.lessonplan_time,
                member_id_member:member_id,
                member_name:member_name
            }

            connection.query('SELECT COUNT(`community_id_community`) AS COUNTNUM FROM `lessonplan` WHERE `community_id_community`=?',[community_id],function(err,countResults){
                if(err) throw err;

                var countNum = countResults[0].COUNTNUM;
                
                if(countNum == 1){
                    connection.query('UPDATE `lessonplan` SET ? WHERE `community_id_community`=?',[sql,community_id],function(err,updateResults){
                        if(err) throw err;
                        cb(updateResults);
                        connection.release();
                    })
                }
                else{
                    connection.query('INSERT INTO `lessonplan` SET ?',sql,function(err,insertResults){
                        if(err) throw err;
                        cb(insertResults);
                        connection.release();
                    })
                }
            })
        })
    },

    saveUnitandActivity: function(community_id,lessonplanData,member_id,member_name){
        const activityArray = lessonplanData.lessonplan_activity_name.split(',');

        // lessonplan_activity_nameArray.map(function(data){
        //     return new Promise(function(resolve,reject){
        //         pool.getConnection(function(err,connection){
        //             let sql = {
        //                         community_id_community:community_id,
        //                         lessonplan_unit_name:lessonplanData.lessonplan_unit_name,
        //                         lessonplan_activity_name:data,
        //                         member_id_member:member_id,
        //                         member_name:member_name
        //                     }

                    

        //             // connection.query('SELECT COUNT(`community_id_community`) AS COUNTNUM FROM `lessonplan_activity_process` WHERE `community_id_community`=?',[community_id],function(err,rows,fields){
        //             //     if(err) return reject(err)

        //             //     let countNum = rows[0].COUNTNUM;

        //             //     console.log(countNum)
                        
        //             //     if(countNum !== 0){
        //             //         connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `community_id_community`=?',[sql,community_id],function(err,rows,fields){
        //             //             if(err) return reject(err)

        //             //             resolve(rows);
        //             //         })
        //             //     }
        //             //     else{
        //             //         connection.query('INSERT INTO `lessonplan_activity_process` SET ?',sql,function(err,rows,fields){
        //             //             if(err) return reject(err)

        //             //             resolve(rows);
        //             //         })
        //             //     }

        //             // })
        //         })
        //     })
            
        // })
    },

    saveLessonplanActivityProcess: function(community_id,lessonplanData,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            var lessonplan_version = lessonplanData.lessonplan_version;
            var lessonplan_unit_name = lessonplanData.lessonplan_unit_name;
            var lessonplan_activity_name = lessonplanData.lessonplan_activity_name;

            var sql = {
                community_id_community:community_id,
                lessonplan_version:lessonplan_version,
                lessonplan_unit_name:lessonplan_unit_name,
                lessonplan_activity_name:lessonplan_activity_name,
                lessonplan_activity_content:lessonplanData.lessonplan_activity_content,
                member_id_member:member_id,
                member_name:member_name
            }
            connection.query('SELECT COUNT(`lessonplan_activity_content`) AS COUNTNUM FROM `lessonplan_activity_process` WHERE `community_id_community` =? AND `lessonplan_version` =? AND `lessonplan_unit_name` =? AND `lessonplan_activity_name` = ?',[community_id,lessonplan_version,lessonplan_unit_name,lessonplan_activity_name],function(err,countResults){
                if(err) throw err;

                var countNum = countResults[0].COUNTNUM;
                
                if(countNum == 1){
                    connection.query('UPDATE `lessonplan_activity_process` SET ? WHERE `community_id_community` =? AND `lessonplan_version` =? AND `lessonplan_unit_name` =? AND `lessonplan_activity_name` = ?',[sql,community_id,lessonplan_version,lessonplan_unit_name,lessonplan_activity_name],function(err,updateResults){
                        if(err) throw err;
                        cb(updateResults);
                        connection.release();
                    })
                }
                else{
                    connection.query('INSERT INTO `lessonplan_activity_process` SET ?',sql,function(err,insertResults){
                        if(err) throw err;
                        cb(insertResults);
                        connection.release();
                    })
                }
            })
        })
    },

    saveLessonplanStage: function(community_id,lessonplanData,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            var lessonplan_stage_type = lessonplanData.lessonplan_stage_type;

            var sql = {
                community_id_community:community_id,
                lessonplan_stage_type:lessonplan_stage_type,
                lessonplan_stage_content:lessonplanData.lessonplan_stage_content,
                member_id_member:member_id,
                member_name:member_name
            }
            connection.query('SELECT COUNT(`lessonplan_stage_content`) AS COUNTNUM FROM `lessonplan_stage` WHERE `community_id_community` =?  AND `lessonplan_stage_type` =? ',[community_id,lessonplan_stage_type],function(err,countResults){
                if(err) throw err;

                var countNum = countResults[0].COUNTNUM;
                
                if(countNum == 1){
                    connection.query('UPDATE `lessonplan_stage` SET ? WHERE `community_id_community` =?  AND `lessonplan_stage_type` =? ',[sql,community_id,lessonplan_stage_type],function(err,updateResults){
                        if(err) throw err;
                        cb(updateResults);
                        connection.release();
                    })
                }
                else{
                    connection.query('INSERT INTO `lessonplan_stage` SET ?',sql,function(err,insertResults){
                        if(err) throw err;
                        cb(insertResults);
                        connection.release();
                    })
                }
            })
        })
    },

    selectLessonplanUnitandActivityData: function(community_id,lessonplan_version,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT * FROM `lessonplan_unit` WHERE `community_id_community`=? AND `lessonplan_version` =?',[community_id,lessonplan_version],function(err,results){
                cb(results);
                connection.release();
            })
        })
    },

    selectLessonplanActivityProcess: function(community_id,lessonplan_version,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT * FROM `lessonplan_activity_process` WHERE `community_id_community`=? AND `lessonplan_version` =?',[community_id,lessonplan_version],function(err,results){
                cb(results);
                connection.release();
            })
        })
    },
    
    selectLessonplanStageData: function(community_id,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT * FROM `lessonplan_stage` WHERE `community_id_community`=?',[community_id],function(err,results){
                cb(results);
                connection.release();
            })
        })
    }
}