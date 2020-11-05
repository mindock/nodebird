import { PassportStatic } from "passport";
import { Strategy } from 'passport-kakao';
import { User } from "../entity/User";

export default (passport: PassportStatic) => {
    passport.use(new Strategy({
        clientID: process.env.KAKAO_ID!,
        clientSecret: process.env.KAKAO_SECRET!,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ snsId: profile.id, provider: 'kakao' });
            if (user) {
                return done(null, user);
            }

            const newUser = User.create({
                email: profile._json && profile._json.kakao_account.email,
                nick: profile.displayName,
                snsId: profile.id,
                provider: profile.provider,
            })
            await newUser.save();
            return done(null, newUser);
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }));
};