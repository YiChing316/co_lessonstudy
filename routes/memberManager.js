var express = require('express');
var router = express.Router();
var community = require('../models/community');
var memberManager = require('../models/memberManager');

/* GET 社群成員管理 page. */
router.get('/:community_id', function(req, res, next) {
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    
    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        var community_name;
        var communityData,communityMemberData,applicationData;
        community.selectCommunityName(community_id)
        .then(function(data){
            community_name = data[0].community_name;
            return memberManager.selectThisCommunity(community_id)
        })
        .then(function(communitydata){
            communityData = JSON.stringify(communitydata)
            return memberManager.selectThisCommunityMember(community_id)
        })
        .then(function(memberdata){
            communityMemberData = JSON.stringify(memberdata)
            return memberManager.selectThisCommunityApplication(community_id)
        })
        .then(function(resultdata){
            applicationData = JSON.stringify(resultdata)
            res.render('memberManager', { title: '社群成員',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name,
                                            communityData:communityData,
                                            communityMemberData:communityMemberData,
                                            applicationData:applicationData
                                        });
        })
    }
});

router.post('/:community_id/sendApplicationResult',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var application_id = req.body.application_id;
        var application_member_id = req.body.member_id;
        var application_member_name = req.body.member_name;
        var application_status = req.body.application_status;

        memberManager.updateCommunityApplicationStatus(application_id,application_status)
        .then(function(data){
            if(application_status == '申請成功'){
                return community.addCommunityMember(community_id,application_member_id,application_member_name,'teammember')
            }
            //申請失敗
            else{
                res.json({msg:'ok'})
            }
        })
        .then(function(data){
            res.json({msg:'ok'})
        })
    }
})

router.post('/:community_id/updateCommunityData',function(req,res,next){
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    if(!member_id){
        res.json({msg:"no"});
        res.redirect('/member/login');
    }
    else{
        var updataData = req.body;
        memberManager.updateCommunityData(community_id,updataData)
        .then(function(selectdata){
            res.json({msg:'ok',selectData:selectdata})
        })
    }
})

module.exports = router;