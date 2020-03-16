var pool = require('./connectMysql');
var resourcepool = require('./connectClsMysql');

module.exports = {
    //判斷此lessonplan是否已有儲存領域、版本、年級
    checklessonplandata: function(community_id,cb){
        pool.getConnection(function(err,connection){
            if (err) throw err;

            connection.query('SELECT `lessonplan_field`,`lessonplan_version`,`lessonplan_grade` FROM `lessonplan` WHERE `community_id_community`=?',[community_id],function(err,results){
                if(results.length){
                    if(err) throw err;
                    cb(results);
                    connection.release();
                }
                else{
                    cb({isExisted:false});
                    connection.release();
                }
            })
        })
    },

    //選取有條件單元
    getcourseunitwhere: function(course_field,course_version,course_grade,cb){

        resourcepool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query('SELECT * FROM `course` WHERE `course_field` =? AND `course_version`=? AND `course_grade`=? GROUP BY `course_unit_name`',[course_field,course_version,course_grade],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
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

        switch(fieldcontent_field){
            case "自然":
                fieldcontent_field = "自";
                break;
            case "國語":
                fieldcontent_field = "國";
                break;
            case "數學":
                fieldcontent_field = "數"
                break;
            case "英語":
                fieldcontent_field = "英";
                break;
        }
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
            connection.query('SELECT * FROM `core_competency_fieldcontent` WHERE `fieldcontent_field`=? AND `fieldcontent_stage`=?',[fieldcontent_field,fieldcontent_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })

    },

    getlearning_focus_item: function(learning_focus_field,learning_focus_stage,cb){
        
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
            connection.query('SELECT `learning_focus_type`,`learning_focus_item` FROM `learning_focus` WHERE `learning_focus_field`=? AND `learning_focus_stage`=? GROUP BY `learning_focus_item`',[learning_focus_field,learning_focus_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    getlearning_focus_childitem: function(learning_focus_field,learning_focus_stage,cb){

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
            connection.query('SELECT `learning_focus_type`,`learning_focus_item`,`learning_focus_childitem` FROM `learning_focus` WHERE `learning_focus_field`=? AND `learning_focus_stage`=? GROUP BY `learning_focus_childitem`',[learning_focus_field,learning_focus_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    },

    getlearning_focus_content: function(learning_focus_field,learning_focus_stage,cb){
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
            connection.query('SELECT * FROM `learning_focus` WHERE `learning_focus_field`=? AND `learning_focus_stage`=? ',[learning_focus_field,learning_focus_stage],function(err,results){
                if(err) throw err;
                cb(results);
                connection.release();
            })
        })
    }
}