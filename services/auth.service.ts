import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import mongoDbUserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
interface AuthResult {
  error?: string;
  token?: string;
  username?: string;
  name?: string;
}

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
        username: user.username,
        id: user._id,
      };
    
      const token = jwt.sign(
        userForToken,
        process.env.SECRET!,
        { expiresIn: 60 * 60 }
      );
    
      return { 
        token, 
        username: user.username, 
        name: user.name 
      };
  }
}

export default AuthService;