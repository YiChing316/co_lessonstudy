var pool = require('./connectMysql');

module.exports = {

    saveLessonplanandUnitActivity: function(community_id,lessonplanData,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;

            var sql;
            if(lessonplanData.stage == 'lessonplan'){
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
            }
            else{//lessonplanData.stage為lessonplan_unit
                sql = {
                    community_id_community:community_id,
                    lessonplan_version:lessonplanData.lessonplan_version,
                    lessonplan_unit_name:lessonplanData.lessonplan_unit_name,
                    lessonplan_unit_activity:lessonplanData.lessonplan_unit_activity,
                    member_id_member:member_id,
                    member_name:member_name
                }
            }
            
            connection.query('SELECT COUNT(`community_id_community`) AS COUNTNUM FROM `'+lessonplanData.stage+'` WHERE `community_id_community`=?',[community_id],function(err,countResults){
                if(err) throw err;

                var countNum = countResults[0].COUNTNUM;
                
                if(countNum == 1){
                    connection.query('UPDATE `'+lessonplanData.stage+'` SET ? WHERE `community_id_community`=?',[sql,community_id],function(err,updateResults){
                        if(err) throw err;
                        cb(updateResults);
                        connection.release();
                    })
                }
                else{
                    connection.query('INSERT INTO `'+lessonplanData.stage+'` SET ?',sql,function(err,insertResults){
                        if(err) throw err;
                        cb(insertResults);
                        connection.release();
                    })
                }
            })
        })
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

    //判斷此lessonplan是否已有儲存領域、版本、年級
    checklessonplandata: function(community_id,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT * FROM `lessonplan` WHERE `community_id_community`=?',[community_id],function(err,results){
                if(results.length){
                    if(err) throw err;
                    cb(results);
                    connection.release();
                }
                else{
                    cb({isExisted:false});
                    connection.release();
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
    }
}