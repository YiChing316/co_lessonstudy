var express = require('express');
var router = express.Router();
var community = require('../models/community');

router.get('/', function(req, res, next) {
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;
  var allCommunityData,communityNumber;

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
      if(memberResults.length){
        var memberCommunityData = JSON.stringify(memberResults);
          res.render('dashboard', { title: 'dashboard',member_id:member_id,member_name:member_name,allCommunityData:allCommunityData,memberCommunityData:memberCommunityData,communityNumber:communityNumber});
      }
      else{
        var memberCommunityData = 0;
          res.render('dashboard', { title: 'dashboard',member_id:member_id,member_name:member_name,allCommunityData:allCommunityData,memberCommunityData:memberCommunityData,communityNumber:communityNumber});
      }
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
          console.log(results)
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
          res.json({msg:'yes',community_id:community_id});
        }
      })
    }
});

module.exports = router;