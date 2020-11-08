import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../entity/User';

export default (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              return done(null, user);
            }
            return done(null, null, { message: '비밀번호가 일치하지 않습니다.' });
          }
          return done(null, null, { message: '가입되지 않은 회원입니다.' });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
