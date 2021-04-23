import {Router} from 'express'
import { LockNotSupportedOnGivenDriverError } from 'typeorm';

import auth from './auth'
import user from './user'

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);

export default routes;