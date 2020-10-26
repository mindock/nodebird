import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import pageRouter from './routes/page';

interface HttpError extends Error {
    status?: number;
}

// 서버 시작할 때, .env 파일의 비밀키들을 process.env에 넣는다.
dotenv.config();

const app = express();

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
app.set('port', process.env.PORT || 8001);

// logging
app.use(morgan('dev'));
// set static directory
app.use(express.static(path.join(__dirname, 'public')));
// parse request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// parse cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// manage session
app.use(session({
    // 요청이 왔을 때, 세션을 다시 저장할지 여부
    resave: false,
    // 세션에 저장할 내역이 없더라도 세션을 저장할지 여부
    saveUninitialized: false,
    // 비밀키 역할
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true, // true: 클라이언트에서 쿠키를 확인 불가능
        secure: false, // false: https가 아닌 환경에서도 사용 가능
    },
}));
// represent one-time message
app.use(flash());

app.use('/', pageRouter);

app.use((req, res, next) => {
    const err: HttpError = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err: HttpError, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중`);
});