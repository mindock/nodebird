import { NextFunction, Request, Response } from 'express';

/*
 passport에서 req 객체에 isAuthenticated 메서드를 추가한다.
*/
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(403).send('로그인 필요');
};

export const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};
