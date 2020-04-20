const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);//express-session을 쓰기때문에 express-session보다 아래 위치
const redis = require('redis');
require('dotenv').config();

const indexRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8001);
passportConfig(passport);

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
    app.use(helmet()); //보안이 강력해 iframe을 사용 못하게 할 수있어 옵션으로 변경을 해줘야 한다.
    app.use(hpp());
} else { //development
    app.use(morgan('dev'));
}
app.use('/', express.static(path.join(__dirname, 'public')));//main.css
app.use('/img', express.static(path.join(__dirname, 'upload')));// /img/abc.png
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    logError: true
});
const sessionOption = {
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure: false,
    },
    store: new RedisStore({client}),
}
if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true; //https
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/',indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello'); // console.info 대체
    logger.error(err.message); //console.error 대체
    next(err);
});
app.use((err,req,res)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'?err:{};
    res.status(err.status || 500);
    res.render('error');
});


app.listen(app.get('port'), ()=>{
    console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
});