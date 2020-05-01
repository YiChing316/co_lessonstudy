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

    createNewIdeaNode:function(community_id,nodeData,fileData,member_id,member_name){
        var node_title = nodeData.node_title;
        var node_tag = nodeData.node_tag;
        var idea_content = nodeData.idea_content;
        var node_id;
        var nodeResults;
        module.exports.createNewNode(community_id,node_title,node_tag,'idea',member_id,member_name)
        .then(function(data){
            nodeResults = data;
            node_id = nodeResults.insertId;
            return module.exports.ideaNode(node_id,idea_content)
        })
        .then(function(ideaResults){
            return module.exports.saveIdeaFile(community_id,fileData,node_id)
        })
        .then(function(fileResults){
            return nodeResults;
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
    }
}