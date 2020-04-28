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