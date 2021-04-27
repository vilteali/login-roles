import {Request, Response, NextFunction} from 'express';
import { getRepository } from 'typeorm';

import {User} from '../entity/User';


export const checkRole = (roles: Array<string>) => {
  return async (request: Request, response: Response, next: NextFunction) => {

    const {userId} = response.locals.jwtPayload;
    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.findOneOrFail(userId);

    }
    catch(e) {
      return response.status(401).json({message: 'Not Authorized'});
    }

    // check
    const {role} = user;
    if(roles.includes(role)) {
      next();
    }else{
      response.status(401).json({message: 'Not Authorized'});
    }

  }
}