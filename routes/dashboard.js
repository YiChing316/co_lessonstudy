var express = require('express');
var router = express.Router();
var dashboard = require('../models/community');

router.get('/', function(req, res, next) {
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;

  res.render('dashboard', { title: 'dashboard',member_id:member_id,member_name:member_name});
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

module.exports = router;