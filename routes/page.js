const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn} = require('./middlewares');
const { Post , User } = require('../models');
//프로필 페이지
router.get('/profile',isLoggedIn, (req,res)=>{
    res.render('profile', {title:'내 정보 - NodeBird', user:req.user});
});

//회원가입 페이지
router.get('/join',isNotLoggedIn, (req,res)=>{
    res.render('join',{
        title:'회원가입 - NodeBird',
        user: req.user,
        joinError: req.flash('joinError'),
    });
});

//메인 페이지
router.get('/', (req,res,next)=>{
    console.log(req.user);
    Post.findAll({
        include:[{
            model:User,
            attributes: ['id', 'nick'],
        },{
            model:User,
            attributes:['id', 'nick'],
            through: "Like",
            as:"Liker",
        }]
    })
        .then((posts)=>{
            console.log(posts);
            res.render('main', {
                title:'NodeBird',
                twits:posts,
                user:req.user,
                loginError: req.flash('loginError',)
            });
        })
        .catch((error)=>{
            console.error(error);
            next(error);
        });

});

module.exports = router;