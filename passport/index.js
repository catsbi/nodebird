const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

const user = {};

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        if (user[id]) {
            done(user[id]);
        } else {
            /**
             * req.user를 수정하고싶으면 deserializeUser에서 수정하면 된다.
             * include의 as에 들어가는 항목은 models/index에서 선언한 아래 코드에서 as를 넣어주면 된다.
             * 그럼 그 부분을 가져온다.
             * db.User.belongsToMany(db.User, {through:'Follow', as:'Followers', foreignKey: 'followingId'});
             * db.User.belongsToMany(db.User, {through:'Follow', as:'Following', foreignKey: 'followerId'});
             */
            User.findOne({
                where: { id },
                include: [{
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                }, {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }]
            })
                .then(user => done(null, user))
                .catch(err => done(err))
        }
    });
    local(passport);
    kakao(passport);
};


/**
 *Strategy(전략): 누구를 로그인 시킬 것인가.
 *
 * 매 요청 시마다 passport.session()여기서 deserializeUser가 실행
 * user.id를 DB조회 후 req.user로
 *
 * const user = {} 선언을 통해 user를 캐싱해 빈번한 db요청을 막을 수 있다.
 */