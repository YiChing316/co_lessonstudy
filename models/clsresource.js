var pool = require('./connectMysql');
var resourcepool = require('./connectClsMysql');

module.exports = {
    //判斷此lessonplan是否已有儲存領域、版本、年級
    checklessonplandata: function(community_id,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT `lessonplan_field`,`lessonplan_version`,`lessonplan_grade` FROM `lessonplan` WHERE `community_id_community`=?',[community_id],function(err,results){
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

    //選取有條件單元
    getcourseunitwhere: function(course_field,course_version,course_grade,cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course` WHERE `course_field` =? AND `course_version`=? AND `course_grade`=? GROUP BY `course_unit_name`',[course_field,course_version,course_grade],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    },

    //選取出有條件的活動
    getcourseactivitywhere: function(course_field,course_version,course_grade,cb){
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course` WHERE `course_field` =? AND `course_version`=? AND `course_grade`=?',[course_field,course_version,course_grade],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取全部單元資料
    getcourseunit: function(cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course` GROUP BY `course_unit_name`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    },

    //選取全部活動資料
    getcourseactivity: function(cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    }
}