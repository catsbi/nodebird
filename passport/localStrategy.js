const LocalStrategy = require('passport-local').Strategy;
/**
 * bcrypt : 비밀번호를 암호화해주는 알고리즘 라이브러리
 */
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        //form 에서 해석한 값들을 매칭시켜준다.(app.js의 app.use(express.urlencoded({extended:false}));
        usernameField: 'email', //req.body.email
        passwordField: 'password',//req.body.password
    }, async (email, password, done) => {//done(에러, 성공, 실패)
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                //비밀번호 검사
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '이메일-비밀번호 조합이 맞지 않습니다.' });
                }
            } else {
                done(null, false, { message: '이메일-비밀번호 조합이 맞지 않습니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};