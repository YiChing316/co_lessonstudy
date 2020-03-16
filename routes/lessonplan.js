var express = require('express');
var router = express.Router();
var community = require('../models/community');
var clsresource = require('../models/clsresource');

/* GET lessonplan page. */
router.get('/edit/:community_id', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var unitData,activityData,ccdimesionData,ccitemData,ccfieldData;

    community.checkCommunityMember(community_id,member_id,function(results){

        if(results.isExisted){
            //檢查是否已有儲存過年級版本
            clsresource.checklessonplandata(community_id,function(selResults){
                //沒有儲存資料
                if(selResults.isExisted == false){
                    clsresource.getcourseunit(function(unitResults){

                        unitData = JSON.stringify(unitResults);

                        clsresource.getcourseactivity(function(actResults){
                            activityData = JSON.stringify(actResults);
                            res.render('lessonplanEdit', { title: '教案製作',member_id:member_id,member_name:member_name,community_id:community_id,unitData:unitData,activityData:activityData,course_field:'',course_grade:'',ccdimesionData:'',ccitemData:'',ccfieldData:''});
                        });
                    });
                }
                //已經有儲存
                else{
                    var basicData = selResults[0];
                    var course_field = basicData.lessonplan_field;
                    var course_version = basicData.lessonplan_version;
                    var course_grade = basicData.lessonplan_grade;

                    clsresource.getcourseunitwhere(course_field,course_version,course_grade,function(unitResults){
                        unitData = JSON.stringify(unitResults);

                        clsresource.getcourseactivitywhere(course_field,course_version,course_grade,function(actResults){
                            activityData = JSON.stringify(actResults);
                            
                            //根據已設定好的年級、領域抓取核心素養內容
                            clsresource.getcore_competency_dimesion(function(dimesionResults){
                                ccdimesionData = JSON.stringify(dimesionResults);

                                clsresource.getcore_competency_item(function(itemResults){
                                    ccitemData = JSON.stringify(itemResults);

                                    clsresource.getcore_competency_fieldcontent(course_field,course_grade,function(fieldResults){
                                        ccfieldData = JSON.stringify(fieldResults);
                                        
                                        res.render('lessonplanEdit', { title: '教案製作',member_id:member_id,member_name:member_name,community_id:community_id,unitData:unitData,activityData:activityData,course_field:course_field,course_grade:course_grade,ccdimesionData:ccdimesionData,ccitemData:ccitemData,ccfieldData:ccfieldData});

                                    })//getcore_competency_fieldcontent end

                                })//getcore_competency_item end
                            })//getcore_competency_dimesion end
                            
                            
                        })//getcourseactivitywhere end
                    })//getcourseunitwhere end
                }
            })
        }
        //如果community_id為會員無加入的社群則會被退回dashboard頁面
        else{
            res.redirect('/dashboard');
        }
    })
   
});

module.exports = router;