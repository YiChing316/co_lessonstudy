var express = require('express');
var router = express.Router();
var community = require('../models/community');
var clsresource = require('../models/clsresource');
var lessonplan = require('../models/lessonplan');
var multer = require('multer');

/* GET lessonplan page. */
router.get('/edit/:community_id', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var community_name;

    var basicData;
    var course_field,course_version,course_grade;
    var ccdimesionData,ccitemData,ccfieldData;
    var lfitemData,lfchilditemData,lfcontentData;
    var issuenameData,issuethemeData,issuecontentData;
    var lessonplanActivityProcessData,lessonplanStageData;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        community.selectCommunityName(community_id)//get communityname end
        .then(function(communitydata){
            community_name = communitydata[0].community_name;

            //檢查是否是在此社群
            return community.checkCommunityMember(community_id,member_id)
        })
        .then(function(data){
            if(data.isExisted == true){
                //檢查是否已有儲存過年級版本
                return lessonplan.checklessonplandata(community_id)
            }
            else{
                //如果community_id為使用者無加入的社群則會被退回dashboard頁面
                res.redirect('/dashboard');
            }
        })
        .then(function(checkdata){
            //沒有儲存過基本資料資料
            if(checkdata.isExisted == false){
                res.render('lessonplanEdit', { title: '教案製作',
                                                member_id:member_id,
                                                member_name:member_name,
                                                community_id:community_id,
                                                community_name:community_name,
                                                course_field:'',
                                                course_grade:'',
                                                course_version:'',
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
                                                lessonplanActivityProcessData:'""',
                                                lessonplanStageData:'""'
                                            });
            }
            else{
                basicData = checkdata[0];
                course_field = basicData.lessonplan_field;
                course_version = basicData.lessonplan_version;
                course_grade = basicData.lessonplan_grade;

                basicData = JSON.stringify(basicData);

                //根據已設定好的年級、領域抓取核心素養內容
                return clsresource.getcore_competency_dimesion();
            }
        })
        .then(function(ccdimesiondata){
            ccdimesionData = JSON.stringify(ccdimesiondata);

            return clsresource.getcore_competency_item()
        })
        .then(function(ccitemdata){
            ccitemData = JSON.stringify(ccitemdata);

            return clsresource.getcore_competency_fieldcontent(course_field,course_grade)
        })
        .then(function(ccfielddata){
            ccfieldData = JSON.stringify(ccfielddata);

            return clsresource.getlearning_focus_item(course_field,course_grade)
        })
        .then(function(lfitemdata){
            lfitemData = JSON.stringify(lfitemdata);

            return clsresource.getlearning_focus_childitem(course_field,course_grade)
        })
        .then(function(lfchilddata){
            lfchilditemData = JSON.stringify(lfchilddata);

            return clsresource.getlearning_focus_content(course_field,course_grade)
        })
        .then(function(lfcontentdata){
            lfcontentData = JSON.stringify(lfcontentdata);

            return clsresource.getissue_name()
        })
        .then(function(issuenamedata){
            issuenameData = JSON.stringify(issuenamedata);

            return clsresource.getissue_theme()
        })
        .then(function(issuethemedata){
            issuethemeData = JSON.stringify(issuethemedata);

            return clsresource.getissue_content(course_grade)
        })
        .then(function(issuecontentdata){
            issuecontentData = JSON.stringify(issuecontentdata);

            return lessonplan.selectLessonplanActivityProcess(community_id)
        })
        .then(function(processdata){
            lessonplanActivityProcessData = JSON.stringify(processdata);

            return lessonplan.selectLessonplanStageData(community_id)
        })
        .then(function(stagedata){
            lessonplanStageData = JSON.stringify(stagedata);

            res.render('lessonplanEdit', { title: '教案製作',
                                            member_id:member_id,
                                            member_name:member_name,
                                            community_id:community_id,
                                            community_name:community_name,
                                            course_field:course_field,
                                            course_grade:course_grade,
                                            course_version:course_version,
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
                                            lessonplanActivityProcessData:lessonplanActivityProcessData,
                                            lessonplanStageData:lessonplanStageData
                                        });
        })
        .catch(function (err) {console.log(err);});
    }
});

router.post('/edit/:community_id/save',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var stage = req.body.stage;
    var lessonplanData = req.body;

    if(!member_id){
        res.redirect('/member/login');
        res.json({msg:"no"});
    }
    else{
        switch(stage){

            case 'lessonplan':
                lessonplan.saveLessonplan(community_id,lessonplanData,member_id,member_name)
                .then(function(data){
                    if(data){
                        return res.json({msg:'ok'})
                    }
                })
                break;
            case 'lessonplan_unit':
                lessonplan.saveUnitandActivity(community_id,lessonplanData,member_id,member_name)
                .then(function(data){
                    if(data){
                        return res.json({msg:'ok'})
                    }
                })
                break;
            case 'activiy_process':
                var lessonplan_activity_process_id = lessonplanData.lessonplan_activity_process_id;
                lessonplan.saveActivityFile(community_id,lessonplanData)
                .then(function(fileResults){
                    return lessonplan.saveLessonplanActivityProcess(lessonplan_activity_process_id,fileResults,member_id,member_name)
                })
                .then(function(data){
                    if(data){
                        return res.json({msg:'ok'})
                    }
                })
                break;
            case 'lessonplan_stage':
                lessonplan.saveLessonplanStage(community_id,lessonplanData,member_id,member_name)
                .then(function(data){
                    if(data){
                        return res.json({msg:'ok'})
                    }
                })
                break;
        }

    }
})

router.post('/edit/delete',function(req,res,next){
    var member_id = req.session.member_id;
    
    if(!member_id){
        res.redirect('/member/login');
        res.json({msg:"no"});
    }
    else{
        var lessonplanData= req.body;
        
        lessonplan.deletLessonplanActivityProcess(lessonplanData)
        .then(function(data){
            if(data){
                data = JSON.stringify(data)
                res.json({msg:"ok",selectData:data});
            }
        })
    }
    
})

var upload = multer({
    storage: multer.diskStorage({
      destination: function(req, file, callback){
        var member_id = req.session.member_id;
        var community_id = req.params.community_id;
        var path = './public/communityfolder/community_'+community_id+'/member_'+member_id+'/multeruploads';
        callback(null, path);
      }
    })
  });

router.post('/edit/:community_id/uploadfile',upload.single('file'),function(req,res){
    // console.log(req.file)
    res.send(req.file)
})

module.exports = router;