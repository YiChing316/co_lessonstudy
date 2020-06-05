var pool = require('./connectMysql');
var kbScanffold = ["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];

module.exports = {

    selectContentScanffold: function(community_id,memberarray){
        var ideaScaffoldData = [];
        return Promise.all(
            memberarray.map(function(data){
                var member_id = data.member_id;
                var member_name = data.member_name;

                return module.exports.selectPersonalIdeaContent(community_id,member_id)
                .then(function(textcontent){
                    return module.exports.countScanffold(textcontent)
                })
                .then(function(countdata){
                    ideaScaffoldData.push({member_id:member_id,member_name:member_name,count:countdata})
                    return ideaScaffoldData
                })
            })
        )
        .then(function(data){
            return ideaScaffoldData
        })
    },

    selectPersonalIdeaContent: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT i.`idea_content` FROM `node` n INNER JOIN `idea` i ON n.`node_id` = i.`node_id_node` WHERE `community_id_community` = ? AND `member_id_member` = ?',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
        .then(function(data){
            var textcontent = [];
            for(i in data){
                var idea_content = data[i].idea_content;
                textcontent.push(idea_content)
            }
            textcontent = textcontent.toString();
            return textcontent
        })
    },

    countScanffold: function(textcontent){
        var countScanffold = [];
        var newObj = new Object();
        kbScanffold.forEach(function(value){
            var re = new RegExp(value,'g');
            var match = (textcontent.match(re));
            if(match){
                var count = match.length;
                newObj[value] = count;
            }
        })
        countScanffold = JSON.stringify(newObj);
        return countScanffold;
    },

    selectNodeAction: function(community_id,memberarray){
        var addNodeData = [];
        var buildonNodeData = [];
        var reviseNodeData = [];
        var viewNodeData = [];
        return Promise.all(
            memberarray.map(function(data){
                var member_id = data.member_id;
                var member_name = data.member_name;
                return module.exports.countPersonaladdNode(community_id,member_id)
                .then(function(adddata){
                    addNodeData.push({member_id:member_id,member_name:member_name,count:adddata})
                    return module.exports.countPersonalbuildonNode(community_id,member_id)
                })
                .then(function(buildondata){
                    buildonNodeData.push({member_id:member_id,member_name:member_name,count:buildondata})
                    return module.exports.countPersonalreviseNode(community_id,member_id)
                })
                .then(function(revisedata){
                    reviseNodeData.push({member_id:member_id,member_name:member_name,count:revisedata})
                    return module.exports.countPersonalviewNode(community_id,member_id)
                })
                .then(function(viewdata){
                    viewNodeData.push({member_id:member_id,member_name:member_name,count:viewdata})
                    return viewNodeData
                })
            })
        )
        .then(function(){
            return {addNodeData:addNodeData,buildonNodeData:buildonNodeData,reviseNodeData:reviseNodeData,viewNodeData:viewNodeData}
        })
    },

    selectCommunityMamber: function(community_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `member_id_member` AS member_id ,`member_name` FROM `community_member` WHERE `community_id_community` = ?',community_id,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    countPersonaladdNode: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT COUNT(`node_id`) as number,`node_type` FROM `node` WHERE `community_id_community` = ? AND `member_id_member` = ? GROUP BY `node_type`',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    countPersonalbuildonNode: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT COUNT(n.`node_id`) as number,n.`node_type` FROM `node` n LEFT JOIN `edge` e ON n.`node_id`= e.`edge_to` WHERE n.`community_id_community` = ? AND n.`member_id_member` = ? GROUP BY n.`node_type`',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    countPersonalreviseNode: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT SUM(`node_revised_count`) as number,`node_type` FROM `node` WHERE `community_id_community` = ? AND `member_id_member` = ? GROUP BY `node_type`',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    countPersonalviewNode: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `community_member_readcount` AS number FROM `community_member` WHERE `community_id_community`= ? AND `member_id_member` = ?',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    selectIncreaseNode: function(community_id,memberarray){
        var increaseData = []
        return Promise.all(
            memberarray.map(function(data){
                var member_id = data.member_id;
                var member_name = data.member_name;
                return module.exports.countPersonalIncreaseNode(community_id,member_id)
                .then(function(countdata){
                    if(countdata.length !== 0){
                        countdata.forEach(function(val){
                            increaseData.push(val)
                        })
                    }
                    return increaseData
                })
            }) 
        )
        .then(function(data){
            return increaseData
        })
    },

    countPersonalIncreaseNode: function(community_id,member_id){
        return new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT DATE_FORMAT(`node_createtime`,"%Y-%m-%d") AS day,`member_id_member` AS member_id,`member_name`,COUNT(`node_id`) AS node_count FROM `node` WHERE `community_id_community` = ? AND `member_id_member` = ? GROUP BY day',[community_id,member_id],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }
}