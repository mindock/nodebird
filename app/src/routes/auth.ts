import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { isLoggedIn, isNotLoggedIn } from './middlewares';
import { JoinUserDTO } from '../dto/UserDTO';
import { User } from '../entity/User';

const router = express.Router();

router.post<{}, {}, JoinUserDTO>('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            return res.redirect('/join');
        }

        const hash = await bcrypt.hash(password, 12);
        const newUser = User.create({
            email,
            nick,
            password: hash,
        });
        await newUser.save();
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError: Error | null, user?: User | null, info?: { message: string }) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info?.message!);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session?.destroy((err) => {
        if (!err) {
            return;
        }
        console.error(err);
        res.redirect('/');
    });
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

export default router;