const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Post, Hashtag, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'upload/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf());
        }
    }),
    limit: { fileSize: 5 * 1024 * 1024 },
});
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log("/img::",req.file, req.file.filename);
    res.json({ url: `/img/${req.file.filename}` })
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    //게시글 업로드
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user:req.user,
            twits:posts,
        })
    } catch (error) {
        console.error(error);
        next(error);
    }

});

router.post('/:id/like',isLoggedIn, async (req,res,next)=>{
    try{
        const post = await Post.findOne({where:{id:req.params.id}});
        await post.addLiker(req.user.id);
        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
});
router.delete('/:id/unlike',isLoggedIn, async (req,res,next)=>{
    try{
        const post = await Post.findOne({where:{id:req.params.id}});
        await post.removeLiker(req.user.id);
        res.send('OK');
    }catch(error){
        console.error(error);
        next(error);
    }
});


module.exports = router;