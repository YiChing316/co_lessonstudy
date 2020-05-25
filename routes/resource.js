var express = require('express');
var router = express.Router();
var community = require('../models/community');
var resourceManager = require('../models/resourceManager');

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
            res.render('resource', { title: '資源管理',
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

module.exports = router;