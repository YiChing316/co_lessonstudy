var express = require('express');
var router = express.Router();
var community = require('../models/community');
var clsresource = require('../models/clsresource');
var lessonplan = require('../models/lessonplan');

/* GET lessonplan page. */
router.get('/edit/:community_id', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var unitData,activityData;
    var ccdimesionData,ccitemData,ccfieldData;
    var lfitemData,lfchilditemData,lfcontentData;
    var issuenameData,issuethemeData,issuecontentData;

    community.checkCommunityMember(community_id,member_id,function(results){

        if(results.isExisted){
            //檢查是否已有儲存過年級版本
            lessonplan.checklessonplandata(community_id,function(selResults){
                //沒有儲存資料
                if(selResults.isExisted == false){
                    clsresource.getcourseunit(function(unitResults){

                        unitData = JSON.stringify(unitResults);

                        clsresource.getcourseactivity(function(actResults){
                            activityData = JSON.stringify(actResults);

                            res.render('lessonplanEdit', { title: '教案製作',
                                                            member_id:member_id,
                                                            member_name:member_name,
                                                            community_id:community_id,
                                                            unitData:unitData,
                                                            activityData:activityData,
                                                            course_field:'',
                                                            course_grade:'',
                                                            ccdimesionData:'""',//JSON.parse error ''所以給予空{}
                                                            ccitemData:'""',
                                                            ccfieldData:'""',
                                                            lfitemData:'""',
                                                            lfchilditemData:'""',
                                                            lfcontentData:'""',
                                                            issuenameData:'""',
                                                            issuethemeData:'""',
                                                            issuecontentData:'""',
                                                            basicData:'""',
                                                            lessonplanUnitActivityData:'""'
                                                        });   
                        });
                    });
                }
                //已經有儲存
                else{
                    var basicData = selResults[0];
                    var course_field = basicData.lessonplan_field;
                    var course_version = basicData.lessonplan_version;
                    var course_grade = basicData.lessonplan_grade;

                    basicData = JSON.stringify(basicData);

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

                                        clsresource.getlearning_focus_item(course_field,course_grade,function(lfitemResults){
                                            lfitemData = JSON.stringify(lfitemResults);

                                            clsresource.getlearning_focus_childitem(course_field,course_grade,function(childitemResults){
                                                lfchilditemData = JSON.stringify(childitemResults);

                                                clsresource.getlearning_focus_content(course_field,course_grade,function(lfcontentResults){
                                                    lfcontentData = JSON.stringify(lfcontentResults);

                                                    clsresource.getissue_name(function(nameResults){
                                                        issuenameData = JSON.stringify(nameResults);

                                                        clsresource.getissue_theme(function(themeResults){
                                                            issuethemeData = JSON.stringify(themeResults);

                                                            clsresource.getissue_content(course_grade,function(issuecontentResults){
                                                                issuecontentData = JSON.stringify(issuecontentResults);

                                                                lessonplan.selectLessonplanUnitandActivityData(community_id,course_version,function(unitActivityResults){

                                                                    var lessonplanUnitActivityData;
                                                                    lessonplanUnitActivityData = JSON.stringify(unitActivityResults);
                                                                    
                                                                    res.render('lessonplanEdit', { title: '教案製作',
                                                                                                member_id:member_id,
                                                                                                member_name:member_name,
                                                                                                community_id:community_id,
                                                                                                unitData:unitData,
                                                                                                activityData:activityData,
                                                                                                course_field:course_field,
                                                                                                course_grade:course_grade,
                                                                                                ccdimesionData:ccdimesionData,
                                                                                                ccitemData:ccitemData,
                                                                                                ccfieldData:ccfieldData,
                                                                                                lfitemData:lfitemData,
                                                                                                lfchilditemData:lfchilditemData,
                                                                                                lfcontentData:lfcontentData,
                                                                                                issuenameData:issuenameData,
                                                                                                issuethemeData:issuethemeData,
                                                                                                issuecontentData:issuecontentData,
                                                                                                basicData:basicData,//教案基本資料
                                                                                                lessonplanUnitActivityData:lessonplanUnitActivityData
                                                                                            });
                                                                })//getlessonplanUnitandActivity end
                                                            })//getissue_content end
                                                        })//getissue_theme end
                                                    })//getissue_name end
                                                })//getlearning_focus_content end
                                            })//getlearning_focus_childitem end
                                        })//getlearning_focus_item end
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

router.post('/edit/:community_id/save',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var stage = req.body.stage;
    var lessonplanData = req.body;

    switch(stage){

        case 'lessonplan':
        case 'lessonplan_unit':
            lessonplan.saveLessonplanandUnitActivity(community_id,lessonplanData,member_id,member_name,function(results){
                res.json({msg:'ok'})
            })
            break;
        case 'activiy_process':
            lessonplan.saveLessonplanActivityProcess(community_id,lessonplanData,member_id,member_name,function(results){
                res.json({msg:'ok'})
            })
            break;
    }


})

module.exports = router;