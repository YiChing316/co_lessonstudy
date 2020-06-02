var pool = require('./connectMysql');

module.exports = {

    createNewConvergence: function(community_id,convergence_tag,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_id_community:community_id,
                    member_id_member:member_id,
                    member_name:member_name,
                    convergence_tag:convergence_tag
                }

                connection.query('INSERT INTO `convergence` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
        .then(function(insertdata){
            var convergence_id = insertdata.insertId;
            return module.exports.selectThisConvergence(convergence_id)
        })
    },

    saveConvergenceContent: function(convergence_id,convergence_content,convergence_ref_node,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    convergence_content:convergence_content,
                    convergence_ref_node:convergence_ref_node,
                    member_id_member:member_id,
                    member_name:member_name,
                }

                connection.query('UPDATE `convergence` SET ? WHERE `convergence_id`=?',[sql,convergence_id],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
        .then(function(updateResults){
            return module.exports.selectThisConvergence(convergence_id)
        })
    },

    sendMessageContent: function(convergence_id,convergence_tag,message_content,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    convergence_id_convergence:convergence_id,
                    convergence_tag:convergence_tag,
                    message_content:message_content,
                    member_id_member:member_id,
                    member_name:member_name,
                }

                connection.query('INSERT INTO `message_board` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
        .then(function(insertResults){
            var message_id = insertResults.insertId;
            return module.exports.selectThisMessage(message_id)
        })
    },

    selectThisMessage: function(message_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *, DATE_FORMAT(`message_createtime`,"%Y/%m/%d %H:%i") AS `message_time` FROM `message_board` WHERE `message_id`=?',message_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisConvergence: function(convergence_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `convergence` WHERE `convergence_id`=?',convergence_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisTagConvergence: function(community_id,convergence_tag,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `convergence` WHERE `community_id_community`=? AND `convergence_tag` =? AND `node_id_node`= -1',[community_id,convergence_tag],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(selectdata){
            if(selectdata.length > 0){
                return selectdata
            }
            else{
                return module.exports.createNewConvergence(community_id,convergence_tag,member_id,member_name)
            }
        })
    },

    selectThisTagNode: function(community_id,node_tag){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node`.*,`idea`.* FROM `node` INNER JOIN `idea` ON `node`.`node_id`=`idea`.`node_id_node` WHERE `node`.`node_tag` = ? AND `node`.`community_id_community`= ?',[node_tag,community_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisTagMessage: function(convergence_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *, DATE_FORMAT(`message_createtime`,"%Y/%m/%d %H:%i") AS `message_time` FROM `message_board` WHERE `convergence_id_convergence` = ? AND `message_state` = "start"',convergence_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectAllConvergence: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `convergence` WHERE `community_id_community` = ? AND `node_id_node` != -1',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    updateConvergenceTag: function(community_id,oldname,newname){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `convergence` SET `convergence_tag`=? WHERE `community_id_community` =? AND `convergence_tag` =?',[newname,community_id,oldname],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
    },

    updateConvergenceNodeId: function(convergence_id,node_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `convergence` SET `node_id_node`=? WHERE `convergence_id` =?',[node_id,convergence_id],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.updateMessageState(convergence_id)
        })
    },

    updateMessageState: function(convergence_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `message_board` SET `message_state`= "end" WHERE `convergence_id_convergence` =?',convergence_id,function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
    }
}