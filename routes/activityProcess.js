var express = require('express');
var router = express.Router();
var community = require('../models/community');
var activityProcess = require('../models/activityProcess');

/* GET 活動歷程 page. */
router.get('/:community_id', function(req, res, next) {
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    
    var nodeActionData,ideaScaffoldData,ideaIncreaseData,socialmemberData,socialEdgeData;
    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        var community_name,memberArray;
        community.selectCommunityName(community_id)
        .then(function(data){
            community_name = data[0].community_name;
            return activityProcess.selectCommunityMamber(community_id)
        }).then(function(memberdata){
            memberArray = memberdata;
            return activityProcess.selectNodeAction(community_id,memberArray)
        })
        .then(function(data){
            nodeActionData = JSON.stringify(data)
            return activityProcess.selectContentScanffold(community_id,memberArray)
        })
        .then(function(contentdata){
            ideaScaffoldData = JSON.stringify(contentdata);
            return activityProcess.selectIncreaseNode(community_id,memberArray)
        })
        .then(function(increasedata){
            ideaIncreaseData = JSON.stringify(increasedata)
            return activityProcess.selectSocialMember(community_id)
        })
        .then(function(socialmemberdata){
            socialmemberData = JSON.stringify(socialmemberdata)
            return activityProcess.selectSocialEdge(community_id)
        })
        .then(function(socialEdgedata){
            socialEdgeData = JSON.stringify(socialEdgedata)
            res.render('activityProcess', { title: '活動歷程',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name,
                                            nodeActionData:nodeActionData,
                                            ideaScaffoldData:ideaScaffoldData,
                                            ideaIncreaseData:ideaIncreaseData,
                                            socialmemberData:socialmemberData,
                                            socialEdgeData:socialEdgeData
                                        });
        })
    }
});

module.exports = router;