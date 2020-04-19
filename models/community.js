var pool = require('./connectMysql');

module.exports = {
    create: function(community_name,community_key,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_name: community_name,
                    community_key: community_key,
                    member_id_member: member_id,
                    member_name: member_name
                }

                connection.query('INSERT INTO `community` SET ?',sql,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(insertRows){
            //得到剛新增的社群id
            var community_id = insertRows.insertId;
            //將創建人新增進社群成員資料表內
            return module.exports.addCommunityMember(community_id,member_id,member_name,"founder")
        })
    },

    addCommunityMember: function(community_id,member_id,member_name,community_member_identity){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_id_community: community_id,
                    member_id_member: member_id,
                    member_name: member_name,
                    community_member_identity: community_member_identity
                }

                connection.query('INSERT INTO `community_member` SET ?',sql,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    checkCommunityMember: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                //select看社群成員表內是否此會員已在此社群中
                connection.query('SELECT * FROM `community_member` WHERE `community_id_community`=? AND `member_id_member`=?',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);

                    if(rows.length == 1){
                        resolve({isExisted:true});
                        connection.release();
                    }
                    else{
                        connection.query('SELECT * FROM `community` WHERE `community_id`=?',community_id,function(err,rows,fields){
                            if(err) return reject(err);
                            resolve(rows);
                            connection.release();
                        });
                    }
                })
            })
        })
    },

    //使用DATE_FORMAT(欄位名稱,"%Y/%m/%d %T")select出想要的日期時間格式
    showAllCommunity: function(){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community_id`,`community_name`,DATE_FORMAT(`community_createtime`,"%Y/%m/%d %T") AS `community_createtime` FROM `community`',function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //使用到community以及community_member兩張表，故使用inner join選取此會員所在的社群名稱和建立時間
    //使用DATE_FORMAT(欄位名稱,"%Y/%m/%d %T")select出想要的日期時間格式
    showMemberCommunity: function(member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community`.community_id,`community`.community_name,DATE_FORMAT(`community`.community_createtime,"%Y/%m/%d %T") AS `community_createtime`,`community_member`.community_member_id,`community_member`.member_name '+
                                'FROM `community` INNER JOIN `community_member` ON `community`.community_id=`community_member`.community_id_community '+
                                'WHERE `community_member`.member_id_member = ?',[member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectCommunityName: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community_name` FROM `community` WHERE `community_id`=?',[community_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}