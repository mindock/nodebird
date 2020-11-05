import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import { Connection, createConnection } from 'typeorm';
import passport from 'passport';

import pageRouter from './routes/page';
import authRouter from './routes/auth';
import passportConfig from './passport';

interface HttpError extends Error {
    status?: number;
}

// 서버 시작할 때, .env 파일의 비밀키들을 process.env에 넣는다.
dotenv.config();

createConnection()
    .then(async (connection: Connection) => {
        console.log('Entity connected: ', connection.isConnected);

        const app = express();

        passportConfig(passport);

        app.set('view engine', 'html');
        nunjucks.configure('src/views', {
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
        // 요청에 passport 설정을 심는다.
        app.use(passport.initialize());
        // req.session 객체에 passport 정보를 저장한다.
        app.use(passport.session());

        app.use('/', pageRouter);
        app.use('/auth', authRouter);

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
    })
    .catch((err: Error) => console.log('Entity connection error: ', err));