import { Router } from 'express';
import UserController from '../controllers/users.controller';

const usersRouter = Router();

// User management routes
usersRouter.post('/', UserController.createUser);
usersRouter.get('/', UserController.getAllUsers);
// usersRouter.put('/:id', UserController.updateUser);    // Update user
// usersRouter.delete('/:id', UserController.deleteUser); // Delete user

// Cart management routes
usersRouter.post('/cart/add', UserController.addToCart);            // Add to cart
usersRouter.post('/cart/remove', UserController.removeFromCart);    // Remove from cart
usersRouter.post('/cart/clear', UserController.clearCart);          // Clear cart

export default usersRouter;
