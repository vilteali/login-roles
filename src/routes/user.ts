import {Router} from 'express';
import {UserController} from './../controller/UserController';

const router = Router();

router.get('/', UserController.getAll());
router.get('/:id', UserController.getById());
router.post('/', UserController.newUser());
router.patch('/:id', UserController.editUser());
router.delete('/:id', UserController.deleteUser());

export default router;