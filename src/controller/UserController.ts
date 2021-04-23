import {getRepository} from 'typeorm';
import {NextFunction, request, Request, Response} from 'express';
import {User} from '../entity/User';
import {validate} from 'class-validator';

export class UserController {

    static getAll = async (req: Request, res:Response) => {
      const userRespository = getRepository(User);

      try {
        const users = await userRespository.find()
      } 
      catch(e) {
        console.log('User not found in database');
      }

      const users = await userRespository.find();

      if(!(users.length > 0)) {
        res.status(404).json({message: 'Not results'});
      } else {
        res.send(users);
      }
    }
    
    static getByID = async (req: Request, res:Response) => {
      const {id} = req.params;
      const userRepository = getRepository(User);

      try{
        const user = await userRepository.findOneOrFail(id);
        res.send(user);
      }
      catch(e){
        res.status(404).json({message: 'Not result'});
      }

    }

    static newUser = async (req: Request, res:Response) => {
      const {username, password, role} = req.body;
      const user = new User();

      user.username = username;
      user.password = password;
      user.role = role;

      const errors = await validate(user);
      if(errors.length > 0) {
        return res.status(400).json(errors);
      }
      
      const userRepository = getRepository(User);
      try{
        await userRepository.save(user);
      }
      catch(e){
        return res.status(409).json({message: 'Username already exists'});
      }

      res.send('User created');
    }

}