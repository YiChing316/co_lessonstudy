var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var member_id = req.session.member_id;
  var member_name = req.session.member_name;

  res.render('dashboard', { title: 'dashboard',member_id:member_id,member_name:member_name});
});

module.exports = router;