var pool = require('./connectMysql');

module.exports = {
    selectThisCommunity: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `community` WHERE `community_id`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisCommunityMember: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community_member`.*,`member`.`member_school` FROM `community_member` INNER JOIN `member` ON `community_member`.`member_id_member` = `member`.`member_id` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisCommunityApplication: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community_application`.*,`member`.`member_school` FROM `community_application` INNER JOIN `member` ON `community_application`.`member_id_member` = `member`.`member_id` WHERE `community_id_community`=? AND `community_application_status`="處理中"',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisMember: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community_member`.*,`member`.`member_school` FROM `community_member` INNER JOIN `member` ON `community_member`.`member_id_member` = `member`.`member_id` WHERE `community_id_community`=? AND `member_id`=?',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    updateCommunityApplicationStatus: function(application_id,status){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `community_application` SET `community_application_status`= ? WHERE `community_application_id`=?',[status,application_id],function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
    },

    updateCommunityData: function(community_id,updateData){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_name:updateData.community_name,
                    community_key:updateData.community_key,
                    community_intro:updateData.community_intro
                }

                connection.query('UPDATE `community` SET ? WHERE `community_id`=?',[sql,community_id],function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectThisCommunity(community_id)
        })
    }
}
