var pool = require('./connectMysql');

module.exports = {
    selectPersonalResource: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *,DATE_FORMAT(`community_file_uploadtime`,"%Y/%m/%d %H:%i") AS `file_uploadtime` FROM `community_file` WHERE `community_file_share` = 1 AND `community_id_community` = ? AND `member_id_member` = ?',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectCommunityResource: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *,DATE_FORMAT(`community_file_uploadtime`,"%Y/%m/%d %H:%i") AS `file_uploadtime` FROM `community_file` WHERE `community_file_share` = 0 AND `community_id_community` = ?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}