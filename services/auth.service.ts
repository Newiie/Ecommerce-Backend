import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import mongoDbUserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
import { AuthResult } from '../utils/types';

class AuthService {
  private userRepository: IUserRepository;
  constructor() {
    this.userRepository = new mongoDbUserRepository;
  }
  public async authenticateUser(username: string, password: string) : Promise<AuthResult> {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        return { error: 'Invalid username or password' };
      }
    
      const passwordCorrect = user.passwordHash
        ? await bcrypt.compare(password, user.passwordHash)
        : false;
    
      if (!passwordCorrect) {
        return { error: 'Invalid username or password' };
      }
    
      const userForToken = {
        id: user._id,
        role: user.role
      };
    
      const token = jwt.sign(
        userForToken,
        process.env.JWT_SECRET!,
        { expiresIn: 60 * 60 }
      );
    
      return { 
        id: user._id.toString(),
        token,
        role: user.role
      };
  }
}

export default AuthService;