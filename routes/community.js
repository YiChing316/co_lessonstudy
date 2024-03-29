var express = require('express');
var router = express.Router();
var community = require('../models/community');
var node = require('../models/node');
var memberManager = require('../models/memberManager')

router.get('/', function(req, res, next) {
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;
  var allCommunityData,communityNumber;
  var memberCommunityData,applicationCommunityData;

  if(!member_id){
    res.redirect('/member/login');
  }
  else{
    community.showAllCommunity()
    .then(function(allResults){
      allCommunityData = JSON.stringify(allResults);
      communityNumber = allResults.length;
      return community.showMemberCommunity(member_id)
    })
    .then(function(memberResults){
      memberCommunityData = JSON.stringify(memberResults);
      return community.showApplicationCommunity(member_id)
      // res.render('dashboard', { title: 'dashboard',member_id:member_id,member_name:member_name,allCommunityData:allCommunityData,memberCommunityData:memberCommunityData,communityNumber:communityNumber});
    })
    .then(function(applicationResults){
      applicationCommunityData = JSON.stringify(applicationResults);
      res.render('community', { title: '社群入口',member_id:member_id,member_name:member_name,allCommunityData:allCommunityData,memberCommunityData:memberCommunityData,communityNumber:communityNumber,applicationCommunityData:applicationCommunityData});
    })
  } 
});

router.post('/create', function(req, res,next) {
  var member_id = req.session.member_id|| '', 
    member_name =  req.session.member_name || '',
    community_name = req.body.community_name || '',
    community_key = req.body.community_key || '',
    community_intro = req.body.community_intro || '';

    if(!member_id){
      res.redirect('/member/login');
      res.json({msg:'no'});
    }
    else{
      community.create(community_name,community_key,community_intro,member_id,member_name)
      .then(function(results){
        if(results){
          //新增社群時，先建立四個階段的引導Node
          var lessonplan_node = [
            {community_id:results,node_title:'教案基本資料',node_type:'lessonplan',node_x:-262,node_y:-55},
            {community_id:results,node_title:'學生先備概念',node_type:'lessonplan',node_x:47,node_y:84},
            {community_id:results,node_title:'教學設計理念',node_type:'lessonplan',node_x:189,node_y:-189},
            {community_id:results,node_title:'課程學習目標',node_type:'lessonplan',node_x:-73,node_y:-280}
          ]
          
          lessonplan_node.forEach(function(val){
            return node.createNewNode(val.community_id,val.node_title,'',val.node_type,0,member_id,member_name)
            .then(function(data){
              var node_id = data.insertId;
              var updateData = JSON.stringify([{node_id:node_id,node_x:val.node_x,node_y:val.node_y}]);
              return node.updateNodePosition(results,updateData)
            })
          })
          console.log("已創立社群"+results);
          res.json({msg:'yes',community_id:results});
        }
      })
    }
});

router.post('/join', function(req, res,next) {
  var member_id = req.session.member_id || '',
    member_name =  req.session.member_name || '', 
    community_id = req.body.community_id || '',
    community_key = req.body.community_key || '';

    if(!member_id){
      res.redirect('/member/login');
      res.json({msg:'no'});
    }
    else{
      community.checkCommunityMember(community_id,member_id)
      .then(function(checkResults){
        //此人已加入該社群
        if(checkResults.isExisted){
          res.json({msg:'existed'});
        }
        //此人尚未加入該社群，判斷密碼是否正確
        else{
          var currectKey = checkResults[0].community_key;
          if( community_key !== currectKey){
            res.json({msg:'errorKey'});
            return
          }
          //密碼正確則加入社群
          else{
            return community.addCommunityMember(community_id,member_id,member_name,"teammember")
          }
        }
      })
      .then(function(addResults){
        if(addResults){
          console.log("已加入社群")
          res.json({msg:'yes',community_id:community_id});
        }
      })
    }
});

router.post('/application',function(req,res,next){
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;

  if(!member_id){
    res.redirect('/member/login');
    res.json({msg:'no'});
  }
  else{
    var community_id = req.body.community_id;
    community.checkCommunityMember(community_id,member_id)
    .then(function(checkResults){
      //此人已加入該社群
      if(checkResults.isExisted){
        res.json({msg:'existed'});
      }
      //此人尚未加入該社群，判斷密碼是否正確
      else{
        return community.sendCommunityApplication(community_id,member_id,member_name)
      }
    })
    .then(function(results){
      console.log("已申請社群")
      res.json({msg:'yes'})
    })
  }

});

router.post('/cancelApplication',function(req,res,next){
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;

  if(!member_id){
    res.redirect('/member/login');
    res.json({msg:'no'});
  }
  else{
    var community_id = req.body.community_id;
    community.cancelApplication(community_id,member_id)
    .then(function(data){
      res.json({msg:'yes'})
    })
  }

});

router.post('/enterCommunity',function(req,res,next){
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;

  if(!member_id){
    res.redirect('/member/login');
    res.json({msg:'no'});
  }
  else{
    var community_id = req.body.community_id;
    memberManager.selectMemberloginCount(community_id,member_id)
    .then(function(data){
      var originalcount = data[0].community_member_logincount;
      var member_login_count = originalcount +1;
      return memberManager.updateMemberloginCount(member_login_count,community_id,member_id)
    })
    .then(function(data){
      res.json({msg:'ok'})
    })
  }
})

module.exports = router;