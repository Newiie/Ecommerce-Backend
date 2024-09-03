import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

const usersRouter = Router();

// Create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    console.log('Validation failed: Username or password missing');
    return response.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all users and populate notes, children, and parents
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({}).exec(); 
    const populatedUsers = await Promise.all(users.map(async (user) => {
      return {
        ...user.toJSON(), 
      };
    }));

    response.json(populatedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});



export default usersRouter
