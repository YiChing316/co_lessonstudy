var express = require('express');
var router = express.Router();
var community = require('../models/community');
var memberManager = require('../models/memberManager');
var task = require('../models/taskManager');

/* GET 社群成員管理 page. */
router.get('/:community_id', function(req, res, next) {
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;
    
    var memberData,taskData;

    if(!member_id){
        res.redirect('/member/login');
    }
    else{
        var community_name;
        community.selectCommunityName(community_id)
        .then(function(data){
            community_name = data[0].community_name;
            return memberManager.selectThisCommunityMember(community_id)
            
        })
        .then(function(memberdata){
            communityMemberData = JSON.stringify(memberdata);
            return task.selectThisCommunityTask(community_id)
        })
        .then(function(taskdata){
            taskData = JSON.stringify(taskdata)
            res.render('taskManager', { title: '社群成員',
                                            community_id:community_id,
                                            community_name:community_name,
                                            member_id:member_id,
                                            member_name:member_name,
                                            communityMemberData:communityMemberData,
                                            taskData:taskData
                                        });
        })
    }
});

router.post('/:community_id/saveTask',function(req,res,next){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"})
        res.redirect('/member/login');
    }
    else{
        var task_id = req.body.task_id;
        var task_content = req.body.task_content;
        var task_member_id = req.body.task_member_id;
        var task_member_name = req.body.task_member_name;

        task.saveCommunityTask(task_id,task_content,task_member_id,task_member_name,community_id)
        .then(function(selectdata){
            res.json({msg:"ok",selectData:selectdata})
        })
    }
})

router.post('/:community_id/updateStatus',function(req,res,next){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"})
        res.redirect('/member/login');
    }
    else{
        var task_id = req.body.task_id;
        var task_status = req.body.task_status;
        task.updateTaskStatus(task_id,task_status)
        .then(function(data){
            res.json({msg:"ok",updateData:data})
        })
    }
})

router.post('/:community_id/deleteTask',function(req,res,next){
    var community_id = req.params.community_id;
    var member_id = req.session.member_id;
    var member_name = req.session.member_name;

    if(!member_id){
        res.json({msg:"no"})
        res.redirect('/member/login');
    }
    else{
        var task_id = req.body.task_id;
        task.deleteTask(task_id)
        .then(function(data){
            res.json({msg:"ok"})
        })
    }
})

module.exports = router;