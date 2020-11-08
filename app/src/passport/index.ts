import { PassportStatic } from 'passport';
import local from './localStrategy';
import kakao from './kakaoStrategy';
import User from '../entity/User';

const passportConfig = (passport: PassportStatic) => {
  // req.session 객체에 어떤 데이터를 저장할지 선택
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  /*
     매 요청 시 실행된다. -> passport.session() 미들웨어가 호출한다.
     받은 id를 통해 DB에서 사용자 정보를 조회해 req.user에 저장한다.
     -> req.user를 통해 로그인한 사용자 정보를 가져올 수 있다.
    */
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({ id });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  local(passport);
  kakao(passport);
};

export default passportConfig;
