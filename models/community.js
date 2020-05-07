var pool = require('./connectMysql');
var fs = require('fs');

module.exports = {
    createNewFolder: function(path){
        return new Promise(function(resolve,reject){
            if( !fs.existsSync(path)){
                fs.mkdirSync(path, { recursive: true }, function(err){ 
                    if (err) throw err;
                })
                resolve(path)
            }
        })
    },
    
    create: function(community_name,community_key,community_intro,member_id,member_name){
        var community_id,communityPath;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                var sql = {
                    community_name: community_name,
                    community_key: community_key,
                    community_intro:community_intro,
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
            community_id = insertRows.insertId;
            //創立社群資料夾
            var path = './public/communityfolder/community_'+community_id;
            return module.exports.createNewFolder(path)
        })
        .then(function(result){
            communityPath = result;
            //創立放summernote檔案資料夾在社群資料夾內
            var summernotePath = communityPath+'/summernotefile';
            return module.exports.createNewFolder(summernotePath)
        })
        .then(function(result){
             //創立放社群公用檔案資料夾在社群資料夾內
            var filePath = communityPath+'/communityfile';
            return module.exports.createNewFolder(filePath)
        })
        .then(function(result){
            //將創建人新增進社群成員資料表內
            return module.exports.addCommunityMember(community_id,member_id,member_name,"founder")
        })
        .then(function(memeberresults){
            return community_id
        })
    },

    addCommunityMember: function(community_id,member_id,member_name,community_member_identity){
        var insertResults;
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
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
        .then(function(data){
            insertResults = data;
            //新增會員的資料夾
            var path = './public/communityfolder/community_'+community_id+'/member_'+member_id;
            return module.exports.createNewFolder(path)
        })
        .then(function(memberresult){
            var multerpath = memberresult+'/multeruploads';
            return module.exports.createNewFolder(multerpath)
        })
        .then(function(result){
            return insertResults
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

    sendCommunityApplication: function(community_id,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_id_community:community_id,
                    member_id_member:member_id,
                    member_name:member_name,
                    community_application_status:'處理中'
                }

                connection.query('SELECT COUNT(`member_id_member`) AS member_id FROM `community_application` WHERE `community_id_community` =? AND `member_id_member` =?',[community_id,member_id],function(err,countResults,fields){
                    if(err) return reject(err);
    
                    var countNum = countResults[0].COUNTNUM;
                    if(countNum == 1){

                    }
                    else{
                        connection.query('INSERT INTO `community_application` SET ?',sql,function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
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
                connection.query('SELECT `community_id`,`community_name`,`community_intro`,DATE_FORMAT(`community_createtime`,"%Y/%m/%d %T") AS `community_createtime` FROM `community`',function(err,rows,fields){
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
                connection.query('SELECT `community`.community_id,`community`.community_name,`community`.community_intro,DATE_FORMAT(`community`.community_createtime,"%Y/%m/%d %T") AS `community_createtime`,`community_member`.community_member_id,`community_member`.member_name '+
                                'FROM `community` INNER JOIN `community_member` ON `community`.community_id=`community_member`.community_id_community '+
                                'WHERE `community_member`.member_id_member = ?',[member_id],function(err,rows,fields){
                    if(err) return reject(err);

                    if(rows.length == 0){
                        resolve(0)
                    }
                    else{
                        resolve(rows);
                    }
                    connection.release();
                })
            })
        })
    },

    showApplicationCommunity: function(member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community`.community_id,`community`.community_name,`community_application`.member_id_member,`community_application`.member_name,`community_application`.community_application_status FROM `community` INNER JOIN `community_application` ON `community`.community_id=`community_application`.community_id_community WHERE `community_application`.member_id_member = ?',[member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    
                    if(rows.length == 0){
                        resolve(0)
                    }
                    else{
                        resolve(rows);
                    }
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