var pool = require('./connectMysql');

module.exports = {
    create: function(community_name,community_key,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;

            var sql = {
                community_name: community_name,
                community_key: community_key,
                member_id_member: member_id,
                member_name: member_name
            }

            connection.query('INSERT INTO `community` SET ?',sql,function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    addCommunityMember: function(community_id,member_id,member_name,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;

            var sql = {
                community_id_community: community_id,
                member_id_member: member_id,
                member_name: member_name
            }

            connection.query('INSERT INTO `community_member` SET ?',sql,function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    checkCommunityMember: function(community_id,member_id,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //select看社群成員表內是否此會員已在此社群中
            connection.query('SELECT * FROM `community_member` WHERE `community_id_community`=? AND `member_id_member`=?',[community_id,member_id],function(err,seleResults){
                if(err) throw err;

                if(seleResults.length){
                    cb({isExisted:true});
                    connection.release();
                }
                else{
                    connection.query('SELECT * FROM `community` WHERE `community_id`=?',[community_id],function(err,results){
                        if(err) throw err;
                        cb(results);
                        connection.release();
                    });
                }
            })   
        })
    },

    showAllCommunity: function(cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `community_id`,`community_name`,`community_createtime` FROM `community`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //使用到community以及community_member兩張表，故使用inner join選取此會員所在的社群名稱和建立時間
    showMemberCommunity: function(member_id,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `community`.community_id,`community`.community_name,`community`.community_createtime,`community_member`.community_member_id,`community_member`.member_name '+
                            'FROM `community` INNER JOIN `community_member` ON `community`.community_id=`community_member`.community_id_community '+
                            'WHERE `community_member`.member_id_member =?',[member_id],function(err,results){
                                if(err) throw err;
                                cb(results);
                                connection.release();
            })
        })
    }
}