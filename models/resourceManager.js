var pool = require('./connectMysql');
var fs = require('fs');

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
    },

    selectThisResource: function(community_file_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT *,DATE_FORMAT(`community_file_uploadtime`,"%Y/%m/%d %H:%i") AS `file_uploadtime` FROM `community_file` WHERE `community_file_id` = ?',community_file_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    saveResourceFile: function(community_id,fileData,community_file_share,member_id,member_name){
        if(fileData.length >0){
            console.log("檔案數量:"+fileData.length)
            var resultArray = [];
            return Promise.all(
                fileData.map(function(data){
                    var newpath;
                    if(community_file_share == 1){
                        newpath = './public/communityfolder/community_'+community_id+'/member_'+member_id+'/';
                    }
                    else{
                        newpath = './public/communityfolder/community_'+community_id+'/communityfile/';
                    }
                    return new Promise(function(resolve,reject){
                        pool.getConnection(function(err,connection){
                            if(err) return reject(err);
    
                            var originalname = data.originalname;
                            var oldpath = data.path;
                            var filetype = data.mimetype;
                            if(fs.existsSync(oldpath)){
                                fs.renameSync(oldpath,newpath+originalname,function(err){
                                    if (err) throw err;
                                })
                            }
    
                            switch(filetype){
                                case "image/png":
                                case "image/jpeg":
                                case "image/gif":
                                    filetype = "圖片"
                                    break;
                                default:
                                    filetype = "文件"
                                    break;
                            }
            
                            var sql = {
                                community_id_community:community_id,
                                community_file_name:originalname,
                                community_file_type:filetype,
                                community_file_share:community_file_share,
                                node_id_node:'-2',
                                member_id_member:member_id,
                                member_name:member_name
                            }
            
                            connection.query('INSERT INTO `community_file` SET ?',sql,function(err,insertResults,fields){
                                if(err) return reject(err);
                                resolve(insertResults);
                                connection.release();
                            })
                        })
                    })
                    .then(function(data){
                        var insertid = data.insertId;
                        return module.exports.selectThisResource(insertid)
                    })
                    .then(function(results){
                        resultArray.push(results[0])
                        return results
                    })
                })
            )
            .then(function(data){
                return resultArray
            })
        }
        else{
            console.log("無檔案")
            return fileData
        } 
    },

    saveResourceLink: function(community_id,community_file_name,community_file_share,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                var sql = {
                    community_id_community:community_id,
                    community_file_name:community_file_name,
                    community_file_type:'連結',
                    community_file_share:community_file_share,
                    node_id_node:'-2',
                    member_id_member:member_id,
                    member_name:member_name
                }

                connection.query('INSERT INTO `community_file` SET ?',sql,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(data){
            var insertid = data.insertId;
            return module.exports.selectThisResource(insertid)
        })
    },

    checkFileExists: function(community_id,fileData,community_file_share,member_id){

        if(community_file_share == 1){
            return new Promise(function(resolve,reject){
                if(fileData.length >0){
                    var testarray = [];
                    for(var i=0;i<fileData.length;i++){
                        var originalname = fileData[i].originalname;
                        var filepath = './public/communityfolder/community_'+community_id+'/member_'+member_id+'/'+originalname;
                        if(fs.existsSync(filepath)){
                            testarray.push(originalname)
                        }
                    }
                    resolve(testarray)
                }
                else{
                    resolve("notexist")
                }
            })
        }
        else{
            return new Promise(function(resolve,reject){
                if(fileData.length >0){
                    var testarray = [];
                    for(var i=0;i<fileData.length;i++){
                        var originalname = fileData[i].originalname;
                        var filepath = './public/communityfolder/community_'+community_id+'/communityfile/'+originalname;
                        if(fs.existsSync(filepath)){
                            testarray.push(originalname)
                        }
                    }
                    resolve(testarray)
                }
                else{
                    resolve("notexist")
                }
            })
        }
    },

    shareResource: function(community_id,type,community_file_id,community_file_name,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){

                if(type == "file"){
                    var oldpath = './public/communityfolder/community_'+community_id+'/member_'+member_id+'/'+community_file_name;
                    var newpath = './public/communityfolder/community_'+community_id+'/communityfile/'+community_file_name;

                    if(fs.existsSync(oldpath)){
                        fs.renameSync(oldpath,newpath,function(err){
                            if (err) throw err;
                        })
                    }
                }

                connection.query('UPDATE `community_file` SET `community_file_share`= 0 WHERE `community_file_id` = ?',community_file_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectThisResource(community_file_id)
        })
    },

    deleteResourceFile: function(community_file_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('DELETE FROM `community_file` WHERE `community_file_id` = ?',community_file_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}