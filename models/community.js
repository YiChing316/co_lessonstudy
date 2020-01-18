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

    showAllCommunity: function(cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `community_id`,`community_name`,`community_createtime` FROM `community`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release;
            })
        })
    },

    showMemberCommunity: function(member_id,cb){

    }
}