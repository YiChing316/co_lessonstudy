var pool = require('./connectMysql');

module.exports = {
    saveLessonplan: function(community_id,lessonplanData,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            var sql = {
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
    }
}