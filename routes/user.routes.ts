import { Router } from 'express';
import UserController from '../controllers/users.controller';
import middleware from '../utils/middleware';

const usersRouter = Router();

usersRouter.post('/', UserController.createUser);
usersRouter.get('/', UserController.getAllUsers);

usersRouter.put('/:id', middleware.jwtAuth, UserController.updateUser); 
usersRouter.get('/profile', middleware.jwtAuth, UserController.getUser);
usersRouter.delete('/:id', middleware.jwtAuth, UserController.deleteUser); 
usersRouter.post('/cart/add', middleware.jwtAuth, UserController.addToCart); 
usersRouter.post('/cart/remove', middleware.jwtAuth, UserController.removeFromCart);  
usersRouter.get('/cart/', middleware.jwtAuth, UserController.getCart);
usersRouter.post('/cart/clear', middleware.jwtAuth, UserController.clearCart);         

export default usersRouter;
