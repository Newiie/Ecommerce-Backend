import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import mongodbUserRepository from '../repositories/User/mongodb.user.repository';
import { MongoDbProductRepository } from '../repositories/Product/mongodb.product.repository';

class UserController {
    public userService: UserService;

    constructor() {
        const mongoDbUserRepository = new mongodbUserRepository();
        const mongoDbProductRepository = new MongoDbProductRepository();
        this.userService = new UserService(mongoDbUserRepository, mongoDbProductRepository);
    }

    public createUser = async (req: Request, res: Response) => {
        const { username, name, password } = req.body;

        if (!username || !password) {
            console.log('Validation failed: Username or password missing');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        try {
            const savedUser = await this.userService.createUser(username, name, password);
            res.status(201).json(savedUser);
        } catch (error) {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    };

    public updateUser = async (req: Request, res: Response) => {
        const { username, name, password } = req.body;
        const { id } = req.params;

        if (!id || (!username && !name && !password)) {
            return res.status(400).json({ error: 'Missing user ID or data to update' });
        }

        try {
            // const updatedUser = await this.userService.updateUser(id, { username, name, password });
            // if (!updatedUser) {
            //     return res.status(404).json({ error: 'User not found' });
            // }
            // res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    };

    public deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            // const deletedUser = await this.userService.deleteUser(id);
            // if (!deletedUser) {
            //     return res.status(404).json({ error: 'User not found' });
            // }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    };

    // Add a product to the user's cart
    public addToCart = async (req: Request, res: Response, next: NextFunction) => {
        const { userId, productId, quantity } = req.body;
        console.log("ADD TO CART PARAMS: ", userId, productId, quantity);
        try {
            const updatedUser = await this.userService.addToCart(userId, productId, quantity);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            next(error);
        }
    };

    // Remove a product from the user's cart
    public removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
        const { userId, productId } = req.body;

        try {
            const updatedUser = await this.userService.removeFromCart(userId, productId);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error removing product from cart:', error);
            next(error);
        }
    };

    // Clear the user's cart
    public clearCart = async (req: Request, res: Response) => {
        const { userId } = req.body;

        try {
            const updatedUser = await this.userService.clearCart(userId);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ error: 'Failed to clear cart' });
        }
    };

    public checkout = async (req: Request, res: Response) => {
        const { userId } = req.body;

        try {
            const updatedUser = await this.userService.checkout(userId);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error checking out:', error);
            res.status(500).json({ error: 'Failed to checkout' });
        }
    };

    public getCart = async (req: Request, res: Response) => {
        const { userId } = req.query;   
        console.log("GET CART PARAMS", userId)
            
        try {
            const updatedUser = await this.userService.getCart(userId as string);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error getting cart:', error);    
            res.status(500).json({ error: 'Failed to get cart' });
        }
    };
}

export default new UserController();
