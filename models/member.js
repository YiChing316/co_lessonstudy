var pool = require('./connectMysql'),
    crypto = require('crypto');//加密

module.exports = {

    //加密
    hash: function(str){
        return crypto.createHmac('md5', str).update(str).digest('hex');
    },

    //登入
    login: function(member_account,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT * FROM `member` WHERE `member_account`= ?',[member_account],function(err,results){
                if(err) throw err;

                cb(results);
                connection.release();
            })
        });
    },

    //註冊post
    register: function(member_name,member_city,member_school,member_account,member_password,cb){
        pool.getConnection(function(err,connection){
            if(err) throw err;

            connection.query('SELECT `member_id` FROM `member` WHERE `member_account`=?',[member_account],function(err,seleResults){
                if(err) throw err;

                if(seleResults.length){
                    cb({isExisted:true});
                    connection.release();
                }
                else{
                    var sql = {
                        member_name: member_name,
                        member_city: member_city,
                        member_school: member_school,
                        member_account: member_account,
                        member_password: member_password,
                        member_identity: '教師'
                    };
    
                    connection.query('INSERT INTO `member` SET ?',sql,function(err,results){
                        if(err) throw err;
                        cb(results);
                        connection.release();
                    });
                }
            })
        })
    }

}