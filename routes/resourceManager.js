var express = require('express');
var router = express.Router();
var community = require('../models/community');
var resourceManager = require('../models/resourceManager');
var multer = require('multer');
var fs = require("fs");


/* GET resource page. */
router.get('/:community_id', function(req, res, next) {
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    
    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        var community_name;
        var personalData,communityData;
        community.selectCommunityName(community_id)
        .then(function(data){
            community_name = data[0].community_name;
            return resourceManager.selectPersonalResource(community_id,member_id)
        })
        .then(function(personaldata){
            personalData = JSON.stringify(personaldata);
            return resourceManager.selectCommunityResource(community_id)
        })
        .then(function(communitydata){
            communityData = JSON.stringify(communitydata);
            res.render('resourceManager', { title: '資源管理',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name,
                                            personalData:personalData,
                                            communityData:communityData
                                        });
        })
    }
});

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

router.post('/:community_id/uploadFile',upload.array('resourcefile',5),function(req,res){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var fileData = req.files;
        var community_file_share = req.body.community_file_share;

        resourceManager.checkFileExists(community_id,fileData,community_file_share,member_id)
        .then(function(checkResults){
            if(checkResults == "notexist" || checkResults.length == 0){
                resourceManager.saveResourceFile(community_id,fileData,community_file_share,member_id,member_name)
                .then(function(data){
                    return res.json({msg:"ok",selectData:data})
                })
            }
            else{
                return res.json({msg:"isexist",checkResults:checkResults})
            }
        })
    }
})

router.post('/:community_id/uploadLink',function(req,res){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var community_file_share = req.body.community_file_share;
        var community_file_name = req.body.community_file_name;

        resourceManager.saveResourceLink(community_id,community_file_name,community_file_share,member_id,member_name)
        .then(function(selectdata){
            return res.json({msg:"ok",selectData:selectdata})
        })
    }
})

router.post('/:community_id/deleteResource',function(req,res){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var type = req.body.type;
        var community_file_id = req.body.community_file_id;
        var community_file_name = req.body.community_file_name;
        var path = './public/communityfolder/community_'+community_id+'/member_'+member_id+'/'+community_file_name;

        resourceManager.deleteResourceFile(community_file_id)
        .then(function(data){
            if(type == "file"){
                fs.unlink(path,function(err){
                    if(err) return console.log(err);
                    console.log('file deleted successfully');
                    return res.json({msg:"ok"})
               });
            }
            else{
                return res.json({msg:"ok"})
            }
        })
    }
})

router.post('/:community_id/shareResource',function(req,res){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var type = req.body.type;
        var community_file_id = req.body.community_file_id;
        var community_file_name = req.body.community_file_name;

        resourceManager.shareResource(community_id,type,community_file_id,community_file_name,member_id)
        .then(function(selectdata){
            return res.json({msg:"ok",selectData:selectdata})
        })
    }
})

module.exports = router;