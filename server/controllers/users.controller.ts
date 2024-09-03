import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
    public async createUser(req: Request, res: Response) {
        const { username, name, password } = req.body;

        if (!username || !password) {
            console.log('Validation failed: Username or password missing');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        try {
            const savedUser = await UserService.createUser(username, name, password);
            res.status(201).json(savedUser);
        } catch (error) {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
}

export default new UserController();
