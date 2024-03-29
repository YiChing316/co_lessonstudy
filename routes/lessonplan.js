var express = require('express');
var router = express.Router();
var community = require('../models/community');
var clsresource = require('../models/clsresource');
var lessonplan = require('../models/lessonplan');
var node = require('../models/node');
var convergence = require('../models/convergence');
var memberManager = require('../models/memberManager');
var multer = require('multer');
var fs = require('fs');

/*****實作頁面************************************************************************************ */
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
    var lessonplanActivityName,convergenceData;

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
                return lessonplan.selectLessonplanActivityProcess(community_id)
            }
            else{
                //如果community_id為使用者無加入的社群則會被退回dashboard頁面
                res.redirect('/community');
            }
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
            return convergence.selectAllConvergence(community_id)
        })
        .then(function(convergencedata){
            convergenceData = JSON.stringify(convergencedata);
            //檢查是否已有儲存過年級版本
            return lessonplan.checklessonplandata(community_id)
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
                                                lessonplanActivityProcessData:lessonplanActivityProcessData,
                                                lessonplanActivityName:lessonplanActivityName,
                                                lessonplanStageData:lessonplanStageData,
                                                convergenceData:convergenceData
                                            });
            }
            else{
                basicData = checkdata[0];
                course_field = basicData.lessonplan_field;
                course_version = basicData.lessonplan_version;
                course_grade = basicData.lessonplan_grade;
                basicData = JSON.stringify(basicData);

                if(course_field !== "" && course_version !== "" && course_grade !== ""){
                    //根據已設定好的年級、領域抓取核心素養內容
                    return clsresource.getcore_competency_dimesion()
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
                                                        lessonplanStageData:lessonplanStageData,
                                                        convergenceData:convergenceData
                                                    });
                    })
                }
                else{
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
                                                    basicData:basicData,
                                                    lessonplanActivityProcessData:lessonplanActivityProcessData,
                                                    lessonplanActivityName:lessonplanActivityName,
                                                    lessonplanStageData:lessonplanStageData,
                                                    convergenceData:convergenceData
                                            });
                }
            }
        })
        .catch(function (err) {console.log(err);});
    }
});

//儲存實作內容
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
            case 'creatActivityModal':
            case 'editActivityModal':
                var node_id,process_id,selectnodedata,activityNameData;
                var baseid = lessonplanData.baseid;
                var lessonplan_activity_name = lessonplanData.lessonplan_activity_name;
                if(baseid == ""){
                    node.createNewNode(community_id,lessonplan_activity_name,'','activity',0,member_id,member_name)
                    .then(function(nodedata){
                        node_id = nodedata.insertId;
                        return lessonplan.insertActivity(community_id,lessonplanData,node_id,member_id,member_name)
                    })
                    .then(function(data){
                        process_id = data;
                        return node.selectThisNode(community_id,node_id)
                    })
                    .then(function(selectdata){
                        selectnodedata = selectdata;
                        return lessonplan.selectLessonplanActivityName(community_id)
                    })
                    .then(function(namedata){
                        activityNameData = namedata;
                        return community.selectCommunityTag(community_id)
                    })
                    .then(function(selectdata){
                        var community_tag = selectdata[0].community_tag.split(',');
                        community_tag.push(lessonplan_activity_name);
                        community_tag = community_tag.toString();
                        return community.updateCommunityTag(community_id,community_tag)
                    })
                    .then(function(tagdata){
                        if(tagdata){
                            return res.json({msg:'ok',process_id:process_id,selectnodeData:selectnodedata,activityNameData:activityNameData,tagData:tagdata})
                        }
                    })
                }
                else{
                    var oldname,node_id,tagData,nodeData;
                    lessonplan.selecThisActivity(baseid)
                    .then(function(activitydata){
                        oldname = activitydata[0].lessonplan_activity_name;
                        node_id = activitydata[0].node_id_node;
                        return community.selectCommunityTag(community_id)
                    })
                    .then(function(selectdata){
                        var community_tag = selectdata[0].community_tag.split(',');
                        var newTagArray = [];
                        community_tag.forEach(function(data){
                            if(data !== oldname){
                                newTagArray.push(data)
                            }
                            else{
                                data = lessonplan_activity_name;
                                newTagArray.push(data)
                            }
                        });
                        community_tag = newTagArray.toString();
                        return community.updateCommunityTag(community_id,community_tag)
                    })
                    .then(function(tagdata){
                        tagData = tagdata;
                        return node.updateNodeName(node_id,lessonplan_activity_name)
                    })
                    .then(function(data){
                        return convergence.updateConvergenceTag(community_id,oldname,lessonplan_activity_name)
                    })
                    .then(function(data){
                        return node.editNodeTag(community_id,oldname,lessonplan_activity_name)
                    })
                    .then(function(nodedata){
                        nodeData = nodedata;
                        return lessonplan.updateActivity(community_id,lessonplanData,member_id,member_name)
                    })
                    .then(function(data){
                        return lessonplan.selectLessonplanActivityProcess(community_id)
                    })
                    .then(function(processdata){
                        if(processdata){
                            return res.json({msg:'ok',selectData:processdata,tagData:tagData,nodeData:nodeData})
                        }
                    })
                }
                break;
            case 'activiy_process':
                var lessonplan_activity_process_id = lessonplanData.lessonplan_activity_process_id;
                lessonplan.saveActivityFile(community_id,lessonplanData,member_id,member_name)
                .then(function(fileResults){
                    return lessonplan.saveLessonplanActivityProcess(lessonplan_activity_process_id,fileResults,member_id,member_name)
                })
                .then(function(data){
                    // console.log(data)
                    return lessonplan.selectLessonplanActivityProcess(community_id)
                })
                .then(function(selectdata){
                    if(selectdata){
                        return res.json({msg:'ok',selectData:selectdata})
                    }
                })
                break;
            case 'lessonplan_target':
                var targetData,activityData;
                lessonplan.selectLessonplanTarget(community_id)
                .then(function(results){
                    if(results.length == 1){
                        return lessonplan.updateLessonplanTarget(community_id,lessonplanData,member_id,member_name)
                    }
                    else{
                        return lessonplan.insertLessonplanTarget(community_id,lessonplanData,member_id,member_name)
                    }
                })
                .then(function(saveResults){
                    return lessonplan.selectLessonplanTarget(community_id)
                })
                .then(function(selectResults){
                    targetData = selectResults;
                    return lessonplan.selectLessonplanActivityProcess(community_id)
                })
                .then(function(activityResults){
                    if(activityResults){
                        activityData = JSON.stringify(activityResults)
                        return res.json({msg:'ok',targetData:targetData,activityData:activityData})
                    }
                })
                break;
            case 'lessonplan_stage':
                lessonplan.saveLessonplanStage(community_id,lessonplanData,member_id,member_name)
                .then(function(data){
                    if(data){
                        res.json({msg:'ok'})
                    }
                })
                break;
            case 'customTag':
                lessonplan.saveLessonplanprocessCustomModal(community_id,lessonplanData)
                .then(function(data){
                    if(data){
                        return res.json({msg:'ok'})
                    }
                })
                break;
        }

    }
})

//刪除活動
router.post('/edit/:community_id/deleteActivity',function(req,res,next){
    var member_id = req.session.member_id;

    var community_id = req.params.community_id;
    
    if(!member_id){
        res.redirect('/member/login');
        res.json({msg:"no"});
    }
    else{
        var lessonplanData= req.body;
        var lessonplan_activity_process_id = lessonplanData.lessonplan_activity_process_id;
        var oldname,node_id;
        var nodeData,processData,nameData,tagData;
        lessonplan.selecThisActivity(lessonplan_activity_process_id)
        .then(function(seletedata){
            oldname = seletedata[0].lessonplan_activity_name;
            node_id = seletedata[0].node_id_node;
            return community.selectCommunityTag(community_id)
        })
        .then(function(selectdata){
            var community_tag = selectdata[0].community_tag.split(',');
            var newTagArray = [];
            community_tag.forEach(function(data){
                if(data !== oldname){
                    newTagArray.push(data)
                }
            });
            community_tag = newTagArray.toString();
            return community.updateCommunityTag(community_id,community_tag)
        })
        .then(function(tagdata){
            tagData = tagdata;
            return node.updateDeleteActivityNodeType(community_id,node_id)
        })
        .then(function(nodedata){
            nodeData = nodedata;
            return lessonplan.deleteLessonplanActivityProcess(lessonplanData)
        })
        .then(function(data){
            processData = JSON.stringify(data)
            return lessonplan.selectLessonplanActivityName(community_id)
        })
        .then(function(namedata){
            nameData = JSON.stringify(namedata)
            res.json({msg:"ok",processData:processData,nameData:nameData,nodeData:nodeData,tagData:tagData});
        })
    }
    
})

//Update重新排序活動
router.post('/edit/:community_id/orderActivity',function(req,res,next){
    var member_id = req.session.member_id;

    var community_id = req.params.community_id;
    
    if(!member_id){
        res.redirect('/member/login');
        res.json({msg:"no"});
    }
    else{
        var result = req.body.result;
        lessonplan.selectActivityAllData(result)
        .then(function(dataarray){
            return lessonplan.updateNewOrderActivity(dataarray,community_id)
        })
        .then(function(selectdata){
            res.json({msg:'ok',selectData:selectdata})
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

//上傳評量檔案，一次只能一個檔案
router.post('/edit/:community_id/uploadfile',upload.single('file'),function(req,res){
    var member_id = req.session.member_id;

    var community_id = req.params.community_id;
    var originalname = req.file.originalname;
    var filepath = './public/communityfolder/community_'+community_id+'/communityfile/'+originalname;
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        if(fs.existsSync(filepath)){
            res.json({msg:"isexist"})
        }
        else{
            res.json({msg:"yes",filedata:req.file})
        }
    }
})

//上傳summernote檔案
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

//實作評量檔案刪除
router.post('/edit/:community_id/deletefile',function(req,res){
    var member_id = req.session.member_id;
    var community_id = req.params.community_id;

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
                lessonplan.deleteActivityFile(community_id,filename)
                .then(function(results){
                    fs.unlink(path,function(err){
                        if(err) return console.log(err);
                        console.log('file deleted successfully');
                        res.json({msg:"yes"})
                   });
                })
            }            
        });
    }
 
})

//確認實作檔案資料是否符合社群資料夾內的檔案
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

//抓取自定義流程tag
router.get('/edit/:community_id/getCustomProcessTag',function(req,res){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:"no"})
        res.redirect('/member/login');
    }
    else{
        lessonplan.selectLessonplanprocessCustomModal(community_id)
        .then(function(data){
            if(data.length == 0){
                res.json({msg:"ok",selectData:[]})
            }
            else{
                res.json({msg:"ok",selectData:data})
            }
        })
    }
})


/**教案總覽 */
router.get('/edit/:community_id/overviewLessonplan',function(req,res){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var basicData,stageData,processData;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        lessonplan.selectLessonplanBaicData(community_id)
        .then(function(basicdata){
            basicData = JSON.stringify(basicdata)
            return lessonplan.selectLessonplanStageData(community_id)
        })
        .then(function(stagedata){
            stageData = JSON.stringify(stagedata)
            return lessonplan.selectLessonplanActivityProcess(community_id)
        })
        .then(function(processdata){
            processData = JSON.stringify(processdata)
            return memberManager.selectThisCommunity(community_id)
        })
        .then(function(data){
            var communityData = JSON.stringify(data)
            res.render('overviewLessonplan', { title: '教案總覽',
                                                community_id:community_id,
                                                basicData:basicData,
                                                stageData:stageData,
                                                processData:processData,
                                                communityData:communityData
                                            });
        })
    }
})

/*****想法頁面************************************************************************************ */
router.get('/idea/:community_id/divergence', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var community_name,community_tag;
    var nodeData,edgeData,lessonplanActivityName;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        community.selectCommunityName(community_id)//get communityname end
        .then(function(communitydata){
            community_name = communitydata[0].community_name;
            return community.selectCommunityTag(community_id)
        })
        .then(function(tagdata){
            community_tag = tagdata[0].community_tag;
            return node.selectAllNodeData(community_id)
        })
        .then(function(nodedata){
            nodeData = JSON.stringify(nodedata);
            return node.selectAllEdgeData(community_id)
        })
        .then(function(edgedata){
            edgeData = JSON.stringify(edgedata);
            return lessonplan.selectLessonplanActivityName(community_id)
        })
        .then(function(activitydata){
            lessonplanActivityName = JSON.stringify(activitydata)
            res.render('lessonplanEdit', { title: '教案製作',
                                            mode: 'ideaContent',
                                            community_id:community_id,
                                            community_name:community_name,
                                            community_tag:community_tag,
                                            member_id:member_id,
                                            member_name:member_name,
                                            nodeData:nodeData,
                                            edgeData:edgeData,
                                            lessonplanActivityName:lessonplanActivityName
                                        });
        })
    }
});

//打開想法節點
router.get('/idea/:community_id/divergence/openIdea',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;
    var node_id = req.query.node_id;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var author,ideaData,node_read_count;
        node.selectIdeaData(node_id,community_id)
        .then(function(results){
            author = results[0].member_id_member;
            var read_count = results[0].node_read_count;
            node_read_count = read_count+1;
            ideaData = results;
            return memberManager.selectMemberReadCount(community_id,member_id)
        })
        .then(function(data){
            var originalcount = data[0].community_member_readcount;
            var member_read_count = originalcount +1;
            return memberManager.updateMemberReadCount(member_read_count,community_id,member_id)
        })
        .then(function(data){
            return node.updateReadCount(node_id,node_read_count);
        })
        .then(function(updateResults){
            return node.selectIdeaFile(node_id,community_id)
        })
        .then(function(fileResults){
            var ideaFileData = fileResults;
            if(author !== member_id){
                res.json({msg:'ok',authority:'read',ideaData:ideaData,ideaFileData:ideaFileData})
            }
            else{
                res.json({msg:'ok',authority:'revise',ideaData:ideaData,ideaFileData:ideaFileData})
            }
        })
    }
})

//建立想法節點
router.post('/idea/:community_id/divergence/createIdea',upload.array('ideafile',5),function(req,res){
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
        var node_type = nodeData.node_type;
        var node_title = nodeData.node_title;
        var replyNodeId = nodeData.replyNodeId;
        var node_tag = nodeData.node_tag;
        var node_file_count = nodeData.node_file_count;
        var idea_content = nodeData.idea_content;
        var nodeResults;
        var insertnodeData,insertedgeData;

        //檢查是否已有同檔名檔案存在
        node.checkFileExists(community_id,fileData)
        .then(function(checkResults){
            //沒有的話做儲存
            if(checkResults == "notexist" || checkResults.length == 0){
                node.createNewNode(community_id,node_title,node_tag,node_type,node_file_count,member_id,member_name)
                .then(function(data){
                    nodeResults = data;
                    node_id = nodeResults.insertId;
                    return node.ideaNode(node_id,idea_content)
                })
                .then(function(ideaResults){
                    return node.saveIdeaFile(community_id,fileData,node_id,member_id,member_name)
                })
                .then(function(fileResults){
                    return node.saveEdge(community_id,replyNodeId,node_id)
                })
                .then(function(edgeResults){
                    return node.selectThisNode(community_id,node_id)
                })
                .then(function(selectNodedata){
                    insertnodeData = selectNodedata;
                    return node.selectThisEdge(community_id,node_id)
                })
                .then(function(selectEdgedata){
                    insertedgeData = selectEdgedata;
                    return res.json({msg:"ok",insertnodeData:insertnodeData,insertedgeData:insertedgeData})
                })
            }
            //有的話回傳
            else{
                return res.json({msg:"isexist",checkResults:checkResults})
            }
        })
        
    }
})

//更新想法節點
router.post('/idea/:community_id/divergence/updateIdea',upload.array('ideafile',5),function(req,res){
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
        var node_id = nodeData.revise_node_id;
        var node_title = nodeData.node_title;
        var node_tag = nodeData.node_tag;
        var idea_content = nodeData.idea_content;
        var node_file_count = nodeData.node_file_count;
        var revise_count = nodeData.revise_count + 1;
        var nodeResults;
        
        //檢查是否已有同檔名檔案存在
        node.checkFileExists(community_id,fileData)
        .then(function(checkResults){
            //沒有的話做儲存
            if(checkResults == "notexist" || checkResults.length == 0){
                node.updataNode(node_id,node_title,node_tag,node_file_count,revise_count)
                .then(function(updateResults){
                    return node.ideaNode(node_id,idea_content)
                })
                .then(function(ideaResults){
                    return node.saveIdeaFile(community_id,fileData,node_id,member_id,member_name)
                })
                .then(function(fileResults){
                    return node.selectThisNode(community_id,node_id)
                })
                .then(function(selectNodedata){
                    return res.json({msg:"ok",updatenodeData:selectNodedata})
                })
            }
            //有的話回傳
            else{
                return res.json({msg:"isexist",checkResults:checkResults})
            }
        })
    }
})

//打開實作節點
router.get('/idea/:community_id/divergence/openLessonplanNode',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;
    var node_id = req.query.node_id
    var selectResults;
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        node.selectThisNode(community_id,node_id)
        .then(function(selectdata){
            selectResults = selectdata;
            return memberManager.selectMemberReadCount(community_id,member_id)
        })
        .then(function(data){
            var originalcount = data[0].community_member_readcount;
            var member_read_count = originalcount +1;
            return memberManager.updateMemberReadCount(member_read_count,community_id,member_id)
        })
        .then(function(data){
            return res.json({msg:'ok',selectResults:selectResults})
        })
    }
})

//打開活動節點
router.get('/idea/:community_id/divergence/openActivityNode',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;
    var node_id = req.query.node_id;
    var nodeData;
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        node.selectActivityNode(node_id)
        .then(function(data){
            nodeData = data;
            return memberManager.selectMemberReadCount(community_id,member_id)
        })
        .then(function(data){
            var originalcount = data[0].community_member_readcount;
            var member_read_count = originalcount +1;
            return memberManager.updateMemberReadCount(member_read_count,community_id,member_id)
        })
        .then(function(data){
            res.json({msg:'ok',nodeData:nodeData})
        })
    }
})

//打開收斂節點
router.get('/idea/:community_id/divergence/openConvergenceNode',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;
    var node_id = req.query.node_id;
    var nodeData;
    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        node.selectConvergenceNode(node_id)
        .then(function(data){
            nodeData = data;
            return memberManager.selectMemberReadCount(community_id,member_id)
        })
        .then(function(data){
            var originalcount = data[0].community_member_readcount;
            var member_read_count = originalcount +1;
            return memberManager.updateMemberReadCount(member_read_count,community_id,member_id)
        })
        .then(function(data){
            res.json({msg:'ok',nodeData:nodeData})
        })
    }
})

//刪除想法節點內檔案
router.post('/idea/:community_id/divergence/deletefile',function(req,res){
    var member_id = req.session.member_id;
    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var file_id = req.body.file_id;
        var filepath = req.body.filepath;
        var node_id = req.body.node_id;

        node.deleteIdeaFile(file_id)
        .then(function(results){
            fs.unlink(filepath,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
                // res.json({msg:"yes"})
           });
           return node.selectThisNode(community_id,node_id)
        })
        .then(function(nodedata){
            var node_file_count = nodedata[0].node_file_count;
            if(node_file_count !== 0){
                node_file_count = node_file_count -1;
                return node.updatFileCount(node_id,node_file_count,community_id)
            }
        })
        .then(function(selectdata){
            res.json({msg:"yes",results:selectdata})
        })
    }
})

router.post('/idea/:community_id/divergence/updateNodePosition',function(req,res){
    var member_id = req.session.member_id;
    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var updateData = req.body.updateData;
        node.updateNodePosition(community_id,updateData)
        .then(function(data){
            res.json({msg:"ok",results:data});
        })
    }
})

/*****收斂頁面************************************************************************************ */
router.get('/idea/:community_id/convergence', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    var community_name;
    var tagData,lessonplanActivityName;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        community.selectCommunityName(community_id)//get communityname end
        .then(function(communitydata){
            community_name = communitydata[0].community_name;
            return community.selectCommunityTag(community_id)
        })
        .then(function(tagdata){
            tagData = tagdata[0].community_tag;
            return lessonplan.selectLessonplanActivityName(community_id)
            
        })
        .then(function(activitydata){
            lessonplanActivityName = JSON.stringify(activitydata)
            res.render('lessonplanEdit', { title: '想法收斂',
                                            mode: 'convergenceContent',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name,
                                            community_tag:tagData,
                                            lessonplanActivityName:lessonplanActivityName
                                        });
        })

    }
});

router.get('/idea/:community_id/convergence/selectThisTagNode', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;
    var node_tag = req.query.node_tag;

    var convergenceData,messageData,convergence_id;

    if(!member_id){
        res.json({msg:'no'});
        res.redirect('/member/login');
    }
    else{
        convergence.selectThisTagConvergence(community_id,node_tag,member_id,member_name)
        .then(function(selectdata){
            convergenceData = selectdata;
            convergence_id = convergenceData[0].convergence_id;
            return convergence.selectThisTagMessage(convergence_id)
        })
        .then(function(messagedata){
            messageData = messagedata;
            return convergence.selectThisTagNode(community_id,node_tag)
        })
        .then(function(nodedata){
            res.json({msg:'ok',nodeData:nodedata,convergenceData:convergenceData,messageData:messageData})
        })
    }
})

router.post('/idea/:community_id/convergence/saveConvergence', function(req, res, next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:'no'});
        res.redirect('/member/login');
    }
    else{
        var convergence_id = req.body.convergence_id;
        var convergence_content = req.body.convergence_content;
        var convergence_ref_node = req.body.convergence_ref_node;
        convergence.saveConvergenceContent(convergence_id,convergence_content,convergence_ref_node,member_id,member_name)
        .then(function(data){
            return res.json({msg:'ok',updateData:data});
        })
    }
})

router.post('/idea/:community_id/convergence/creatConvergenceNode', function(req, res, next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:'no'});
        res.redirect('/member/login');
    }
    else{
        var node_id,saveData,nodeData,edgeData;
        var convergence_id = req.body.convergence_id;
        var convergence_tag = req.body.convergence_tag;
        var convergence_content = req.body.convergence_content;
        var convergence_ref_node = req.body.convergence_ref_node;
        
        node.createNewNode(community_id,'收斂結果',convergence_tag,'convergence',0,member_id,member_name)
        .then(function(createdata){
            node_id = createdata.insertId;
            return node.saveEdge(community_id,convergence_ref_node,node_id)
        })
        .then(function(data){
            return node.selectThisNode(community_id,node_id)
        })
        .then(function(nodedata){
            nodeData = nodedata;
            return node.selectThisEdge(community_id,node_id)
        })
        .then(function(edgedata){
            edgeData = edgedata;
            return convergence.updateConvergenceNodeId(convergence_id,node_id)
        })
        .then(function(data){
            return convergence.saveConvergenceContent(convergence_id,convergence_content,convergence_ref_node,member_id,member_name)
        })
        .then(function(savedata){
            saveData = savedata;
            return res.json({msg:'ok',saveData:saveData,nodeData:nodeData,edgeData:edgeData});
        })
    }
})

router.post('/idea/:community_id/convergence/sendMessage', function(req, res, next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:'no'});
        res.redirect('/member/login');
    }
    else{
        var convergence_id = req.body.convergence_id;
        var convergence_tag = req.body.convergence_tag;
        var message_content = req.body.message_content;
        convergence.sendMessageContent(convergence_id,convergence_tag,message_content,member_id,member_name)
        .then(function(insertdata){
            return res.json({msg:'ok',insertData:insertdata});
        })
    }
})

module.exports = router;