import { Router } from 'express';
import UserController from '../controllers/users.controller';

const usersRouter = Router();

usersRouter.post('/', UserController.createUser);
usersRouter.get('/', UserController.getAllUsers);
usersRouter.put('/:id', UserController.updateUser);    
usersRouter.delete('/:id', UserController.deleteUser); 

usersRouter.post('/cart/add', UserController.addToCart); 
usersRouter.post('/cart/remove', UserController.removeFromCart);  
usersRouter.get('/cart/', UserController.getCart);
usersRouter.post('/cart/clear', UserController.clearCart);         

export default usersRouter;
