import { Router } from 'express';
import UserController from '../controllers/users.controller';

const usersRouter = Router();

usersRouter.post('/', UserController.createUser);
usersRouter.get('/', UserController.getAllUsers);

export default usersRouter;
