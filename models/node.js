var pool = require('./connectMysql');
var fs = require('fs');

module.exports = {
    createNewNode: function(community_id,node_title,node_tag,node_type,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_id_community:community_id,
                    member_id_member:member_id,
                    member_name:member_name,
                    node_title:node_title,
                    node_tag:node_tag,
                    node_type:node_type
                }

                connection.query('INSERT INTO `node` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
    },

    ideaNode: function(node_id,idea_content){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    node_id_node:node_id,
                    idea_content:idea_content
                }

                connection.query('INSERT INTO `idea` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
    },

    saveIdeaFile: function(community_id,fileData,node_id){
        if(fileData.length >0){
            console.log("檔案數量:"+fileData.length)
            return Promise.all(
                fileData.map(function(data){
                    var newpath = './public/communityfolder/community_'+community_id+'/communityfile/';
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
                                node_id_node:node_id,
                                community_file_name:originalname,
                                community_file_type:filetype
                            }
            
                            connection.query('INSERT INTO `community_file` SET ?',sql,function(err,insertResults,fields){
                                if(err) return reject(err);
                                resolve(insertResults);
                                connection.release();
                            })
                        })
                    })
                })
            )
        }
        else{
            console.log("無檔案")
            return fileData
        } 
    },

    selectNodeData: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node_id` AS "id",`member_id_member`, `member_name`, `node_title`, `node_tag`, `node_type` AS "group", `node_x` AS "x", `node_y` AS "y", `node_revised_count`, `node_read_count`, DATE_FORMAT(`node_createtime`,"%Y/%m/%d %T") AS "node_createtime" FROM `node` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectEdgeData: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `edge_id` AS "id", `edge_from` AS "from", `edge_to` AS "to" FROM `edge` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    checkFileExists: function(community_id,fileData){
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
}