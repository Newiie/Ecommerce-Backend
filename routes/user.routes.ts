import { Router } from 'express';
import UserController from '../controllers/users.controller';
import middleware from '../utils/middleware';

const usersRouter = Router();

usersRouter.post('/', UserController.createUser);
usersRouter.get('/', UserController.getAllUsers);

usersRouter.put('/:id', middleware.jwtAuth, UserController.updateUser); 
usersRouter.get('/profile', middleware.jwtAuth(['user', 'admin']), UserController.getUser);
usersRouter.delete('/:id', middleware.jwtAuth(['admin']), UserController.deleteUser); 
usersRouter.post('/cart/add', middleware.jwtAuth(['user', 'admin']), UserController.addToCart); 
usersRouter.post('/cart/remove', middleware.jwtAuth(['user', 'admin']), UserController.removeFromCart);  
usersRouter.get('/cart/', middleware.jwtAuth(['user', 'admin']), UserController.getCart);
usersRouter.post('/cart/clear', middleware.jwtAuth(['user', 'admin']), UserController.clearCart);         

export default usersRouter;
