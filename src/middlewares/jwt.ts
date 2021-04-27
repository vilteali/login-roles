import {Request, Response, NextFunction} from 'express';

import * as jwt from 'jsonwebtoken';

import config from '../config/config'

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  console.log('REQ->', request.headers)
  const token = <string>request.headers['auth'];
  let jwtPayload;

  try{
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    response.locals.jwtPayload = jwtPayload;

  }
  catch(e) {
    return response.status(401).json({message: 'Not Authorized'});
  }

  const {userId, username} = jwtPayload;
  const newToken = jwt.sign({userId, username}, config.jwtSecret, {expiresIn:'5m'});

  response.setHeader('token', newToken);
  next();

} 