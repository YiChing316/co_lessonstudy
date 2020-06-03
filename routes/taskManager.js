var express = require('express');
var router = express.Router();
var community = require('../models/community');

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
        community.selectCommunityName(community_id)
        .then(function(data){
            community_name = data[0].community_name;
            res.render('taskManager', { title: '社群成員',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name
                                        });
        })
    }
});

module.exports = router;