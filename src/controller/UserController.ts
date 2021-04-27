import {getRepository} from 'typeorm';
import {Request, Response} from 'express';
import {User} from '../entity/User';
import {validate} from 'class-validator';

export class UserController {

    static getAll = async (req: Request, res: Response) => {
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
    };
    
    static getById = async (req: Request, res: Response) => {
      const {id} = req.params;
      const userRepository = getRepository(User);

      try{
        const user = await userRepository.findOneOrFail(id);
        res.send(user);
      }
      catch(e){
        res.status(404).json({message: 'Not result'});
      }

    };

    static newUser = async (req: Request, res: Response) => {
      const {username, password, role} = req.body;
      const user = new User();

      user.username = username;
      user.password = password;
      user.role = role;

      // validate
      const validationOpt = {validationError: {target: false, value: false}};
      const errors = await validate(user, validationOpt);
      if(errors.length > 0) {
        return res.status(400).json(errors);
      }
      
      const userRepository = getRepository(User);
      try{
        user.hashPassword();
        await userRepository.save(user);
      }
      catch(e){
        return res.status(409).json({message: 'Username already exists'});
      }

      res.send('User created');
    }

    static editUser = async (req: Request, res: Response) => {
     let user;
     const {id} = req.params;
     const {username, role} = req.body;
      
     const userRespository = getRepository(User);
      try{
        user = await userRespository.findOneOrFail(id); 
        user.username = username;
        user.role = role;
      }
      catch(e){
        return res.send(404).json({message: 'User not found'});
      }

      const validationOpt = {validationError: {target: false, value: false}};
      const errors = await validate(user, validationOpt);
      console.error('ERR-->', errors);
      
      console.log('ERR-->', errors);
      
      if(errors.length > 0) {
        return res.status(400).json(errors);
      }

      try{
        await userRespository.save(user);
      }
      catch(e){
        return res.status(409).json({message: 'Username already in use'});
      }
      
      res.status(201).json({message: 'User update'});
    };

    static deleteUser = async (req: Request, res:Response) => {
      const {id} = req.params;
      const userRespository = getRepository(User);
      let user: User;

      try{
        user = await userRespository.findOneOrFail(id);
      }
      catch(e){
        return res.status(404).json({message: 'User not found'});
      }

      userRespository.delete(id);
      res.status(201).json({message: 'User deleted'});
    }; 
}

export default UserController;