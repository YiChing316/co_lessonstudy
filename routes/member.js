var express = require('express');
var router = express.Router();
var member = require('../models/member');


/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: '登入畫面',errmsg:'' });
});

router.post('/login', function(req, res,next) {
    var member_account = req.body.member_account|| '',
    member_password = req.body.member_password|| '';
    
    //將使用者輸入的密碼加密
    var hash_password = member.hash(member_password);

    member.login(member_account,function(results){
        //如果有此帳號
        if(results.length){
            var correctPassword = results[0].member_password;

            //判斷使用者輸入的密碼是否與資料庫中的相符
            if( hash_password !== correctPassword){
                res.json({msg:'no'});
                return
            }
            else{
                //相符
                req.session.member_id = results[0].member_id;
                req.session.member_name = results[0].member_name;
                req.session.member_account = member_account;

                res.json({
                            msg:'yes',
                            member_id:req.session.member_id,
                            member_name:req.session.member_name,
                            member_account:req.session.member_account
                        });
            }
        }
    })

});

/* GET register page. */
router.get('/register', function(req, res, next) {
    res.render('register', { title: '註冊畫面',errmsg:'' });
});

router.post('/register', function(req, res,next) {

    var member_name = req.body.member_name || '',
    member_city = req.body.member_city || '',
    member_school = req.body.member_school || '',
    member_account = req.body.member_account || '',
    member_password = req.body.member_password || '';

    var hash_password = member.hash(member_password);

    member.register(member_name,member_city,member_school,member_account,hash_password,function(results){
        if(results.isExisted){
            console.log("註冊失敗");
            res.json({msg:'no'});
        }
        else{
            console.log("註冊成功");
            res.json({msg:'yes'});
        }
    })
});

//logout
router.get('/logout',function(req, res){
    req.session.destroy();
    res.redirect('/member/login');
});

module.exports = router;