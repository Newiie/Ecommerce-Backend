import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth.service';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';


class AuthController {

    public authService: AuthService;
    constructor() {
        this.authService = new AuthService;
    }

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.cookies === undefined) return res.status(401).json({ message: 'No cookies provided' });
            const refreshToken = req.cookies.refreshToken;
            console.log("Cookies ", req.cookies);
            if (refreshToken === undefined) return res.status(401).json({ message: 'Refresh token not provided' });
            
            const isValid = await this.authService.isRefreshTokenValid(refreshToken);
            if (!isValid) return res.status(401).json({ message: 'Invalid refresh token' });
    
            const secret = process.env.REFRESH_TOKEN_SECRET as string;
            const decoded = jwt.verify(refreshToken, secret) as { id: string; role: string };
            const newAccessToken = this.authService.generateAccessToken(decoded.id, decoded.role);
            const newRefreshToken = this.authService.generateRefreshToken(decoded.id, decoded.role);
    
            await this.authService.saveRefreshToken(decoded.id, newRefreshToken);
            res.cookie('refreshToken', newRefreshToken, { 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'none',
        
            });
    
            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;

            const result = await this.authService.authenticateUser(username, password);
            if (result.error) {
                return res.status(401).json({ error: result.error });
            }

            const { accessToken, refreshToken, id, role } = result;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            return res.status(200).json({ token: accessToken, userId: id, role });
        } catch (error) {
            next(error);
        }
    };

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
    
            if (!refreshToken) {
                return res.status(200).json({ message: 'User already logged out' });
            }
    
            // Optional: Revoke the refresh token
            try {
                await this.authService.revokeRefreshToken(refreshToken);
            } catch (error) {
                logger.error('Failed to revoke refresh token:', error);
            }
    
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
    
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
    
    
}

export default new AuthController();
