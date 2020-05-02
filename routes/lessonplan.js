var express = require('express');
var router = express.Router();
var community = require('../models/community');
var clsresource = require('../models/clsresource');
var lessonplan = require('../models/lessonplan');
var node = require('../models/node');
var multer = require('multer');
var fs = require('fs');

/* GET lessonplan/edit page. */
router.get('/edit/:community_id', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var basicData;
    var course_field,course_version,course_grade;
    var ccdimesionData,ccitemData,ccfieldData;
    var lfitemData,lfchilditemData,lfcontentData;
    var issuenameData,issuethemeData,issuecontentData;
    var lessonplanActivityProcessData,lessonplanStageData;
    var lessonplanActivityName;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        var community_name;
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
                                                mode: 'lessonplanContent',
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
                                                lessonplanActivityName:'""',
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

            return lessonplan.selectLessonplanActivityName(community_id)
        })
        .then(function(activiynamedata){
            lessonplanActivityName = JSON.stringify(activiynamedata)

            res.render('lessonplanEdit', { title: '教案製作',
                                            mode: 'lessonplanContent',
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
                                            lessonplanActivityName:lessonplanActivityName,
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
    var member_id = req.session.member_id;
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        // console.log(req.file)
        res.json({msg:"yes",filedata:req.file})
    }
})

router.post('/edit/:community_id/uploadsummernotefile',upload.array('imageFile',5),function(req,res){
    var member_id = req.session.member_id;
    var community_id = req.params.community_id;
    var path = '/communityfolder/community_'+community_id+'/summernotefile/';
    var patharray = [];
    var today = new Date();
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        for(var i=0;i<req.files.length;i++){
            var oldpath = req.files[i].path;
            var newpath = path+today.getFullYear()+today.getMonth()+today.getDate()+today.getHours()+today.getMinutes()+today.getSeconds()+ req.files[i].originalname;
            fs.rename(oldpath, './public'+newpath, function(err) {
                if (err) {
                    throw err;
                }
                console.log('done!');
            })
            patharray.push({url:newpath});
        }
        res.json({msg:"yes",filepath:patharray})
    }
})

router.post('/edit/:community_id/deletefile',function(req,res){
    var member_id = req.session.member_id;
    var filename = req.body.filename;
    var filepath = req.body.filepath;
    var path = filepath+filename;
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        fs.stat(path, function (err, stats) {
         
            if (err && err.code == 'ENOENT') {
                return res.json({msg:"notsave"})
            }
            else{
                fs.unlink(path,function(err){
                    if(err) return console.log(err);
                    console.log('file deleted successfully');
                    res.json({msg:"yes"})
               }); 
            }            
        });
    }
 
})

router.post('/edit/:community_id/checkfile',function(req,res){
    var filepath = req.body.filepath;
    fs.stat(filepath, function (err, stats) {
         
        if (err && err.code == 'ENOENT') {
            return res.json({msg:"notexist"})
        }
        else{
            res.json({msg:"ok"})
        }            
    });
})


router.get('/idea/:community_id', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var community_name;
    var lessonplanActivityName;
    var nodeData,edgeData;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        community.selectCommunityName(community_id)//get communityname end
        .then(function(communitydata){
            community_name = communitydata[0].community_name;
            return lessonplan.selectLessonplanActivityName(community_id)
        })
        .then(function(activiynamedata){
            lessonplanActivityName = JSON.stringify(activiynamedata)
            return node.selectNodeData(community_id);
        })
        .then(function(nodedata){
            nodeData = JSON.stringify(nodedata);
            return node.selectEdgeData(community_id)
        })
        .then(function(edgedata){
            edgeData = JSON.stringify(edgedata);
            res.render('lessonplanEdit', { title: '教案製作',
                                            mode: 'ideaContent',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name,
                                            lessonplanActivityName:lessonplanActivityName,
                                            nodeData:nodeData,
                                            edgeData:edgeData
                                        });
        })
    }
});


router.post('/idea/:community_id/createIdea',upload.array('ideafile',5),function(req,res){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var nodeData = req.body;
        var fileData = req.files;
        var node_title = nodeData.node_title;
        var node_tag = nodeData.node_tag;
        var idea_content = nodeData.idea_content;
        var nodeResults;

        //檢查是否已有同檔名檔案存在
        node.checkFileExists(community_id,fileData)
        .then(function(checkResults){
            //沒有的話做儲存
            if(checkResults == "notexist" || checkResults.length == 0){
                node.createNewNode(community_id,node_title,node_tag,'idea',member_id,member_name)
                .then(function(data){
                    nodeResults = data;
                    node_id = nodeResults.insertId;
                    return node.ideaNode(node_id,idea_content)
                })
                .then(function(ideaResults){
                    return node.saveIdeaFile(community_id,fileData,node_id)
                })
                .then(function(fileResults){
                    return res.json({msg:"ok",nodeResults:nodeResults})
                })
            }
            //有的話回傳
            else{
                return res.json({msg:"isexist",checkResults:checkResults})
            }
        })
        
    }
})

module.exports = router;