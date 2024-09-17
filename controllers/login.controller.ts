import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth.service';
import logger from '../utils/logger';
class LoginController {

    public authService: AuthService;
    constructor() {
        this.authService = new AuthService;
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
    
            const result = await this.authService.authenticateUser(username, password);
            logger.info(result)
            if (result.error) {
                logger.error(result.error)
                return res.status(401).json({ error: result.error });
            }
    
            res.status(200).send({
                token: result.token,
                username: result.username,
                name: result.name
            });
        } catch (error) {
            logger.error(error)
            next(error)
        }
        
    }
}

export default new LoginController();
