const express = require('express');
const router = express.Router();
const { User } =require('../models');
const { isLoggedIn } = require('./middlewares');

router.post('/:id/follow', isLoggedIn, async (req,res,next)=>{
    try{
        const user = await User.findOne({where:{id:req.user.id}});
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/:id/unfollow', isLoggedIn, async (req,res,next)=>{
    try{
        const user = await User.findOne({where:{id:req.user.id}});
        await user.removeFollowing(parseInt(req.params.id, 10));
        res.send('success');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/profile', async (req, res, next) => {
    try{
        User.update({ nick: req.body.nick }, {
            where: { id: req.user.id },
        });
        res.redirect('/profile');
    }catch(error){
        console.error(error);
        next(error);
    }
});

module.exports=router;


/**
 * Sequelize 쿼리메서드 설명
 * 1. A.getB: 관계있는 로우 조회
 * 2. A.addB: 관계 생성
 * 3. A.setB: 관계 수정
 * 4. A.removeB: 관계 제거
 */