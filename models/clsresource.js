var pool = require('./connectMysql');
var resourcepool = require('./connectClsMysql');

module.exports = {

    //選取核心素養面向
    getcore_competency_dimesion: function(){
        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `core_competency_dimesion` FROM `core_competency` GROUP BY `core_competency_dimesion`',function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        }) 
    },

    //選取總綱核心素養全部內容，要使用其核心素養項目與項目說明
    getcore_competency_item: function(){
        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `core_competency`',function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //選取領域核心素養內涵(需有領域、階段)
    getcore_competency_fieldcontent: function(fieldcontent_field,fieldcontent_stage){

        var fieldArray = fieldcontent_field.split(',');
        var newfieldArray = [];

        for(var i=0;i<fieldArray.length;i++){
            switch(fieldArray[i]){
                case "自然":
                    fieldArray[i] = "'自'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "國語":
                    fieldArray[i] = "'國'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "數學":
                    fieldArray[i] = "'數'"
                    newfieldArray.push(fieldArray[i])
                    break;
                case "英語":
                    fieldArray[i] = "'英'";
                    newfieldArray.push(fieldArray[i])
                    break;
            }
        }

        var field = newfieldArray.toString();
        
        switch(fieldcontent_stage){
            case "第四學習階段(國中)":
                fieldcontent_stage = "國民中學教育（J）";
                break;
            case "第五學習階段(高中)": 
            fieldcontent_stage = "普通型高級中等學校教";
                break;
            default:
                fieldcontent_stage = "國民小學教育（E)"
        }

        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `core_competency_fieldcontent` WHERE `fieldcontent_field` IN ('+field+') AND `fieldcontent_stage` = ?',fieldcontent_stage,function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })

    },

    //選取學習重點項目1(需有領域、學習階段)
    getlearning_focus_item: function(learning_focus_field,learning_focus_stage){

        var fieldArray = learning_focus_field.split(',');
        var newfieldArray = [];

        for(var i=0;i<fieldArray.length;i++){
            switch(fieldArray[i]){
                case "自然":
                    fieldArray[i] = "'自然'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "國語":
                    fieldArray[i] = "'國語'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "數學":
                    fieldArray[i] = "'數學'"
                    newfieldArray.push(fieldArray[i])
                    break;
                case "英語":
                    fieldArray[i] = "'英語'";
                    newfieldArray.push(fieldArray[i])
                    break;
            }
        }

        var field = newfieldArray.toString();
        
        switch(learning_focus_stage){
            case "3年級":
                learning_focus_stage = "第二學習階段(Ⅱ)";
                break;
            case "4年級":
                learning_focus_stage = "第二學習階段(Ⅱ)";
                break;
            case "5年級":
                learning_focus_stage = "第三學習階段(Ⅲ)"
                break;
            case "6年級":
                learning_focus_stage = "第三學習階段(Ⅲ)";
                break;
            case "第四學習階段(國中)":
                fieldcontent_stage = "第四學習階段(Ⅳ)";
                break;
            case "第五學習階段(高中)": 
                fieldcontent_stage = "第五學習階段(Ⅴc)";
                break;
        }

        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `learning_focus_type`,`learning_focus_item` FROM `learning_focus` WHERE `learning_focus_field` IN ('+field+') AND `learning_focus_stage`=? GROUP BY `learning_focus_item`',[learning_focus_stage],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //選取學習重點項目2(需有領域、學習階段)
    getlearning_focus_childitem: function(learning_focus_field,learning_focus_stage){

        var fieldArray = learning_focus_field.split(',');
        var newfieldArray = [];

        for(var i=0;i<fieldArray.length;i++){
            switch(fieldArray[i]){
                case "自然":
                    fieldArray[i] = "'自然'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "國語":
                    fieldArray[i] = "'國語'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "數學":
                    fieldArray[i] = "'數學'"
                    newfieldArray.push(fieldArray[i])
                    break;
                case "英語":
                    fieldArray[i] = "'英語'";
                    newfieldArray.push(fieldArray[i])
                    break;
            }
        }

        var field = newfieldArray.toString();

        switch(learning_focus_stage){
            case "3年級":
                learning_focus_stage = "第二學習階段(Ⅱ)";
                break;
            case "4年級":
                learning_focus_stage = "第二學習階段(Ⅱ)";
                break;
            case "5年級":
                learning_focus_stage = "第三學習階段(Ⅲ)"
                break;
            case "6年級":
                learning_focus_stage = "第三學習階段(Ⅲ)";
                break;
            case "第四學習階段(國中)":
                fieldcontent_stage = "第四學習階段(Ⅳ)";
                break;
            case "第五學習階段(高中)": 
                fieldcontent_stage = "第五學習階段(Ⅴc)";
                break;
        }

        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `learning_focus_type`,`learning_focus_item`,`learning_focus_childitem` FROM `learning_focus` WHERE `learning_focus_field` IN ('+field+') AND `learning_focus_stage`=? GROUP BY `learning_focus_childitem`',[learning_focus_stage],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //選取學習重點全部資料(需有領域、學習階段)
    getlearning_focus_content: function(learning_focus_field,learning_focus_stage){
        var fieldArray = learning_focus_field.split(',');
        var newfieldArray = [];

        for(var i=0;i<fieldArray.length;i++){
            switch(fieldArray[i]){
                case "自然":
                    fieldArray[i] = "'自然'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "國語":
                    fieldArray[i] = "'國語'";
                    newfieldArray.push(fieldArray[i])
                    break;
                case "數學":
                    fieldArray[i] = "'數學'"
                    newfieldArray.push(fieldArray[i])
                    break;
                case "英語":
                    fieldArray[i] = "'英語'";
                    newfieldArray.push(fieldArray[i])
                    break;
            }
        }

        var field = newfieldArray.toString();

        switch(learning_focus_stage){
            case "3年級":
                learning_focus_stage = "第二學習階段(Ⅱ)";
                break;
            case "4年級":
                learning_focus_stage = "第二學習階段(Ⅱ)";
                break;
            case "5年級":
                learning_focus_stage = "第三學習階段(Ⅲ)"
                break;
            case "6年級":
                learning_focus_stage = "第三學習階段(Ⅲ)";
                break;
            case "第四學習階段(國中)":
                fieldcontent_stage = "第四學習階段(Ⅳ)";
                break;
            case "第五學習階段(高中)": 
                fieldcontent_stage = "第五學習階段(Ⅴc)";
                break;
        }

        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `learning_focus` WHERE `learning_focus_field` IN ('+field+') AND `learning_focus_stage`=? ',[learning_focus_stage],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //選取議題
    getissue_name: function(){
        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `issue_name` FROM `issue` GROUP BY `issue_name`',function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //選取學習主題
    getissue_theme: function(){
        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT `issue_id`,`issue_name`,`issue_learning_theme` FROM `issue` GROUP BY `issue_learning_theme`',function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    },

    //選取議題所有資料
    getissue_content: function(issue_stage){

        switch(issue_stage){
            case "第四學習階段(國中)":
                issue_stage = "國中";
                break;
            case "第五學習階段(高中)": 
                issue_stage = "高中";
                break;
            default:
                issue_stage = "國小"
        }

        return new Promise(function(resolve,reject){
            resourcepool.getConnection(function(err,connection){
                if(err) return reject(err);
                connection.query('SELECT * FROM `issue` WHERE `issue_stage`=?',[issue_stage],function(err,rows,fields){
                    if(err) return reject(err);
                    resolve(rows);
                    connection.release();
                })
            })
        })
    }

}