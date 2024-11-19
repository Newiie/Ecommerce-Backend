import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import mongoDbUserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
import { AuthResult } from '../utils/types';
import AppError from '../utils/AppError';
import { RefreshToken } from '../models/auth.model';

class AuthService {
  private userRepository: IUserRepository;
  constructor() {
    this.userRepository = new mongoDbUserRepository;
  }


  public isRefreshTokenValid = async (token: string): Promise<boolean> => {
      const hashedToken = this.hashToken(token);
      const storedToken = await RefreshToken.findOne({ token: hashedToken });
      return !!storedToken;
  };

  public hashToken = (token: string) => token;

  public saveRefreshToken = async (userId: string, token: string) => {
    const hashedToken = this.hashToken(token);
    const refreshToken = new RefreshToken({ userId, token: hashedToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await refreshToken.save();
  };

  public  revokeRefreshToken = async (token: string) => {
    const hashedToken = this.hashToken(token);
    await RefreshToken.deleteOne({ token: hashedToken });
  };

  public generateAccessToken(userId: string, role: string): string {
    const payload = { id: userId, role: role };
    const secret = process.env.JWT_SECRET as string;
    const options = { expiresIn: '15m' }; // Short lifespan for access tokens
    return jwt.sign(payload, secret, options);
  }

  public generateRefreshToken(userId: string, role: string): string {
    const payload = { id: userId, role: role };
    const secret = process.env.REFRESH_TOKEN_SECRET as string; 
    const options = { expiresIn: '7d' }; 

    return jwt.sign(payload, secret, options);
  }

  public async authenticateUser(username: string, password: string) : Promise<AuthResult> {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new AppError('User does not exist', 401);
      }
    
      const passwordCorrect = user.passwordHash
        ? await bcrypt.compare(password, user.passwordHash)
        : false;
    
      if (!passwordCorrect) {
        throw new AppError('Invalid username or password', 401);
      }
    
      const accessToken = this.generateAccessToken(user._id.toString(), user.role.toString()); // Assuming this is your short-term token
      const refreshToken = this.generateRefreshToken(user._id.toString(), user.role.toString()); // Implement this method

      await this.saveRefreshToken(user._id.toString(), refreshToken);
      return { 
        id: user._id.toString(),
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: user.role
      };
  }
}

export default AuthService;