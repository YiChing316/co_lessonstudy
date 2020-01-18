var express = require('express');
var router = express.Router();
var dashboard = require('../models/community');

/* GET lessonplan page. */
router.get('/edit/:community_id', function(req, res, next) {
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    var community_id = req.params.community_id;

    //如果community_id為會員無加入的社群則會被退回dashboard頁面
    dashboard.checkCommunityMember(community_id,member_id,function(results){
        if(results.isExisted){
            res.render('lessonplanEdit', { title: '教案製作',member_id:member_id,member_name:member_name,community_id:community_id});
        }
        else{
            res.redirect('/dashboard');
        }
    })

    
    
});

module.exports = router;