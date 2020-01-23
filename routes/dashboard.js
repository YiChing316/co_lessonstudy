var express = require('express');
var router = express.Router();
var dashboard = require('../models/community');

router.get('/', function(req, res, next) {
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;

  dashboard.showAllCommunity(function(results){
    if(results.length){
      var allCommunityData = JSON.stringify(results);
      var communityNumber = results.length;

      dashboard.showMemberCommunity(member_id,function(memberResults){
        var memberCommunityData = JSON.stringify(memberResults);
        res.render('dashboard', { title: 'dashboard',member_id:member_id,member_name:member_name,allCommunityData:allCommunityData,memberCommunityData:memberCommunityData,communityNumber:communityNumber});
      });
    }
  })

  
});

router.post('/create', function(req, res,next) {
  var member_id = req.session.member_id|| '', 
    member_name =  req.session.member_name || '',
    community_name = req.body.community_name || '',
    community_key = req.body.community_key || '';

  dashboard.create(community_name,community_key,member_id,member_name,function(results){
    if(results){
      
      //得到剛新增的社群id
      var community_id = results.insertId;
      //將創建人新增進社群成員資料表內
      dashboard.addCommunityMember(community_id,member_id,member_name,function(results){
        if(results){
          res.json({msg:'yes'});
        }
      })
    }
    else{
      res.json({msg:'no'});
    }
  })

});

router.post('/join', function(req, res,next) {
  var member_id = req.session.member_id || '',
    member_name =  req.session.member_name || '', 
    community_id = req.body.community_id || '',
    community_key = req.body.community_key || '';
    
    dashboard.checkCommunityMember(community_id,member_id,function(checkResults){
      //此人已加入該社群
      if(checkResults.isExisted){
        res.json({msg:'existed'});
      }
      //此人尚未加入該社群，判斷密碼是否正確
      else{
        var currectKey = checkResults[0].community_key;
        if( community_key !== currectKey){
          res.json({msg:'no'});
          return
        }
        //密碼正確則加入社群
        else{
          dashboard.addCommunityMember(community_id,member_id,member_name,function(addResults){
            if(addResults){
              res.json({msg:'yes',community_id:community_id});
            }
          });
        }
      }
    });

});

module.exports = router;