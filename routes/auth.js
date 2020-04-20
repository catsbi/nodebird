const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

//POST /auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        console.time('암호화 시간 start');
        const hash = await bcrypt.hash(password, 12); //salt가 클 수록 암호화 수준이 높아지지만 속도가 느려진다. 1초정도로 해결될정도가 적절
        console.timeEnd(`암호화 완료`);
        User.findOrCreate({where:{email}, defaults:{ nick,password:hash } })
            .spread(async (user,created)=>{
                console.log(JSON.stringify(user));
                console.log('created::',created);
                if(!created){
                    req.flash('joinError', '이미 가입된 이메일입니다.');
                    return res.redirect('/join');
                } else {
                    return res.redirect('/');
                }
            });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /auth/login
router.post('/login', isNotLoggedIn, (req, res, next) => { //req.body.email, email.body.password
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.log(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => { //req.user <- 사용자정보를 찾을 수 있다.
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req, res, next);
});

//GET /auth/logout
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy(); // req.user
    res.redirect('/');
});

//kakao login (1)
router.get('/kakao', passport.authenticate('kakao'));

//kakao login(3)
router.get('/kakao/callback', passport.authenticate('kakao',{
    failureReDirect:'/',
}), (req,res)=>{
    res.redirect('/');
});



module.exports = router;