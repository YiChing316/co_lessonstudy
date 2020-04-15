var pool = require('./connectMysql');
var resourcepool = require('./connectClsMysql');

module.exports = {

    //選取有條件單元
    getcourseunitwhere: function(course_field,course_version,course_grade,cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            if(course_version == "自編"){
                connection.query('SELECT * FROM `course` WHERE `course_field` =? AND `course_grade`=? GROUP BY `course_unit_name`',[course_field,course_grade],function(err,results){
                    if(err) throw err;
                    cb(results);
                    connection.release();
                })
            }
            else{
                connection.query('SELECT * FROM `course` WHERE `course_field` =? AND `course_version`=? AND `course_grade`=? GROUP BY `course_unit_name`',[course_field,course_version,course_grade],function(err,results){
                    if(err) throw err;
                    cb(results);
                    connection.release();
                })
            }
        })

    },

    //選取出有條件的活動
    getcourseactivitywhere: function(course_field,course_version,course_grade,cb){
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course` WHERE `course_field` =? AND `course_version`=? AND `course_grade`=?',[course_field,course_version,course_grade],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取全部單元資料
    getcourseunit: function(cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course` GROUP BY `course_unit_name`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    },

    //選取全部活動資料
    getcourseactivity: function(cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    },

    //選取核心素養面向
    getcore_competency_dimesion: function(cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `core_competency_dimesion` FROM `core_competency` GROUP BY `core_competency_dimesion`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    },

    //選取總綱核心素養全部內容，要使用其核心素養項目與項目說明
    getcore_competency_item: function(cb){
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `core_competency`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取領域核心素養內涵(需有領域、階段)
    getcore_competency_fieldcontent: function(fieldcontent_field,fieldcontent_stage,cb){

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

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `core_competency_fieldcontent` WHERE `fieldcontent_field` IN ('+field+') AND `fieldcontent_stage` = ?',fieldcontent_stage,function(err,results){
                if(err) throw err;
                cb(results);
                console.log(results)
                connection.release();
            })
        })

    },

    //選取學習重點項目1(需有領域、學習階段)
    getlearning_focus_item: function(learning_focus_field,learning_focus_stage,cb){

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

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `learning_focus_type`,`learning_focus_item` FROM `learning_focus` WHERE `learning_focus_field` IN ('+field+') AND `learning_focus_stage`=? GROUP BY `learning_focus_item`',[learning_focus_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取學習重點項目2(需有領域、學習階段)
    getlearning_focus_childitem: function(learning_focus_field,learning_focus_stage,cb){

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
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `learning_focus_type`,`learning_focus_item`,`learning_focus_childitem` FROM `learning_focus` WHERE `learning_focus_field` IN ('+field+') AND `learning_focus_stage`=? GROUP BY `learning_focus_childitem`',[learning_focus_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取學習重點全部資料(需有領域、學習階段)
    getlearning_focus_content: function(learning_focus_field,learning_focus_stage,cb){
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
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `learning_focus` WHERE `learning_focus_field` IN ('+field+') AND `learning_focus_stage`=? ',[learning_focus_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取議題
    getissue_name: function(cb){
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `issue_name` FROM `issue` GROUP BY `issue_name`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取學習主題
    getissue_theme: function(cb){
        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT `issue_id`,`issue_name`,`issue_learning_theme` FROM `issue` GROUP BY `issue_learning_theme`',function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    //選取議題所有資料
    getissue_content: function(issue_stage,cb){

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

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `issue` WHERE `issue_stage`=?',[issue_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    }

}