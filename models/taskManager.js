var pool = require('./connectMysql');

module.exports = {

    selectThisCommunityTask: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *,DATE_FORMAT(`task_createtime`,"%Y/%m/%d %H:%i") AS `task_time` FROM `task` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisTask: function(task_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *,DATE_FORMAT(`task_createtime`,"%Y/%m/%d %H:%i") AS `task_time` FROM `task` WHERE `task_id`=?',task_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    saveCommunityTask: function(task_id,task_status,task_content,task_member_id,task_member_name,community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    task_content:task_content,
                    task_status:task_status,
                    task_member_id:task_member_id,
                    task_member_name:task_member_name,
                    community_id_community:community_id
                }

                if(task_id == ""){
                    connection.query('INSERT INTO `task` SET ?',sql,function(err,rows,fields){
                        if(err) return reject(err);
                        resolve(rows);
                        connection.release();
                    })
                }
                else{
                    connection.query('UPDATE `task` SET ? WHERE `task_id` = ?',[sql,task_id],function(err,rows,fields){
                        if(err) return reject(err);
                        resolve(rows);
                        connection.release();
                    })
                }
            })
        })
        .then(function(data){
            var id = data.insertId;
            if(task_id == ""){
                task_id = id
            }
            return module.exports.selectThisTask(task_id)
        })
    },

    updateTaskStatus: function(task_id,task_status){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('UPDATE `task` SET `task_status`=? WHERE `task_id` = ?',[task_status,task_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectThisTask(task_id)
        })
    },

    deleteTask: function(task_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('DELETE FROM `task` WHERE `task_id` = ?',task_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}