const KakaoStrategy = require('passport-kakao').Strategy;

const {User} = require('../models');


//kakao login (2) (4)
module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        //form 에서 해석한 값들을 매칭시켜준다.(app.js의 app.use(express.urlencoded({extended:false}));
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {//done(에러, 성공, 실패)
        try {
            const exUser = await User.findOne({
                where: {
                    snsId: profile.id,
                    provide: 'kakao',
                },
            });
            if (exUser) {
                done(null, exUser);
            } else {
                console.log(profile);
                const newUser = await User.create({
                    email: profile._json.kakao_account.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provide: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};