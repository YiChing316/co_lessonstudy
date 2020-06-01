var pool = require('./connectMysql');
var fs = require('fs');

module.exports = {
    createNewNode: function(community_id,node_title,node_tag,node_type,node_file_count,member_id,member_name){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    community_id_community:community_id,
                    member_id_member:member_id,
                    member_name:member_name,
                    node_title:node_title,
                    node_tag:node_tag,
                    node_type:node_type,
                    node_file_count:node_file_count
                }

                connection.query('INSERT INTO `node` SET ?',sql,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
    },

    updataNode: function(node_id,node_title,node_tag,node_file_count,revise_count){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                var sql = {
                    node_title:node_title,
                    node_tag:node_tag,
                    node_file_count:node_file_count,
                    node_revised_count:revise_count
                }

                connection.query('UPDATE `node` SET ? WHERE `node_id`=?',[sql,node_id],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
    },

    ideaNode: function(node_id,idea_content){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('SELECT `idea_id` FROM `idea` WHERE `node_id_node` =?',node_id,function(err,countResults,fields){
                    if(err) return reject(err);

                    //已存在idea內容
                    if(countResults.length == 1){
                        var idea_id = countResults[0].idea_id;
                        connection.query('UPDATE `idea` SET `idea_content`=? WHERE `idea_id`=?',[idea_content,idea_id],function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
                    }
                    //不存在idea內容
                    else{

                        var sql = {
                            node_id_node:node_id,
                            idea_content:idea_content
                        }

                        connection.query('INSERT INTO `idea` SET ?',sql,function(err,insertResults,fields){
                            if(err) return reject(err);
                            resolve(insertResults);
                            connection.release();
                        })
                    }
                })
            })
        })
    },

    saveIdeaFile: function(community_id,fileData,node_id,member_id,member_name){
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
                                community_file_type:filetype,
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
                })
            )
        }
        else{
            console.log("無檔案")
            return fileData
        } 
    },

    saveEdge: function(community_id,replyNodeId,node_id){
        if(replyNodeId !== ""){
            var edge_from_array = replyNodeId.split(',');
            return Promise.all(
                edge_from_array.map(function(edge_from){
                    return new Promise(function(resolve,reject){
                        pool.getConnection(function(err,connection){
                            if(err) return reject(err);
            
                            var sql = {
                                community_id_community:community_id,
                                edge_from:edge_from,
                                edge_to:node_id
                            }
            
                            connection.query('INSERT INTO `edge` SET ?',sql,function(err,insertResults,fields){
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
            return replyNodeId
        }
    },

    selectThisNode: function(community_id,node_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node_id` AS "id",`member_id_member`, `member_name`, `node_title`, `node_tag`, `node_type` AS "group", `node_x` AS "x", `node_y` AS "y", `node_revised_count`, `node_read_count`, DATE_FORMAT(`node_createtime`,"%Y/%m/%d %H:%i") AS "node_createtime", `node_file_count` FROM `node` WHERE `community_id_community`=? AND `node_id`=?',[community_id,node_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectThisEdge: function(community_id,node_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `edge_id` AS "id", `edge_from` AS "from", `edge_to` AS "to" FROM `edge` WHERE `community_id_community`=? AND `edge_to`=?',[community_id,node_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectAllNodeData: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node_id` AS "id",`member_id_member`, `member_name`, `node_title`, `node_tag`, `node_type` AS "group", `node_x` AS "x", `node_y` AS "y", `node_revised_count`, `node_read_count`, DATE_FORMAT(`node_createtime`,"%Y/%m/%d %H:%i") AS "node_createtime", `node_file_count` FROM `node` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectAllEdgeData: function(community_id){
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

    selectIdeaData: function(node_id,community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node`.*,`idea`.* FROM `node` INNER JOIN `idea` ON `node`.`node_id`=`idea`.`node_id_node` WHERE `node`.`node_id` = ? AND `node`.`community_id_community`= ?',[node_id,community_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectIdeaFile: function(node_id,community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `community_file` WHERE `node_id_node` = ? AND `community_id_community`= ?',[node_id,community_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectActivityNode: function(node_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node`.*,`lessonplan_activity_process`.`lessonplan_activity_target` FROM `node` LEFT JOIN `lessonplan_activity_process` ON `node`.`node_id` = `lessonplan_activity_process`.`node_id_node` WHERE`lessonplan_activity_process`.`node_id_node` = ? AND `node`.`node_type` = "activity"',node_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    editNodeTag: function(community_id,oldname,newname){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `node_id`, `node_tag` FROM `node` WHERE `community_id_community`=?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(selectdata){
            return module.exports.changeNodeTag(selectdata,oldname,newname)
        })
        .then(function(data){
            return module.exports.selectAllNodeData(community_id)
        })
    },

    changeNodeTag: function(nodedata,oldname,newname){
        return Promise.all(
            nodedata.map(function(data){
                var node_id = data.node_id;
                var node_tag = data.node_tag;
                if(node_tag !== ""){
                    if(node_tag == oldname){
                        node_tag = newname
                        return module.exports.updateNodeTag(node_id,node_tag)
                    }
                    else{
                        return node_tag
                    }
                }
                else{
                    return nodedata
                }
            })
        )
    },

    updateNodeTag: function(node_id,node_tag){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `node` SET `node_tag`=? WHERE `node_id`=?',[node_tag,node_id],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
    },

    updateNodePosition: function(community_id,updateData){
        var updatearray = JSON.parse(updateData);

        var node_id = updatearray[0].node_id;
        var node_x = updatearray[0].node_x;
        var node_y = updatearray[0].node_y;

        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                var sql = {
                    node_x:node_x,
                    node_y:node_y
                }

                connection.query('UPDATE `node` SET ? WHERE `node_id`=?',[sql,node_id],function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectThisNode(community_id,node_id)
        })
    },
    
    updateDeleteActivityNodeType: function(community_id,node_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `node` SET `node_type`="deleteactivity" WHERE `node_id`=?',node_id,function(err,insertResults,fields){
                    if(err) return reject(err);
                    resolve(insertResults);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectThisNode(community_id,node_id)
        })
    },

    updateReadCount: function(node_id,read_count){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `node` SET `node_read_count`=? WHERE `node_id`=?',[read_count,node_id],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
    },

    updatFileCount: function(node_id,file_count,community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);

                connection.query('UPDATE `node` SET `node_file_count`=? WHERE `node_id`=?',[file_count,node_id],function(err,updateResults,fields){
                    if(err) return reject(err);
                    resolve(updateResults);
                    connection.release();
                })
            })
        })
        .then(function(data){
            return module.exports.selectThisNode(community_id,node_id)
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
    },

    deleteIdeaFile: function(file_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('DELETE FROM `community_file` WHERE `community_file_id` = ?',file_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}