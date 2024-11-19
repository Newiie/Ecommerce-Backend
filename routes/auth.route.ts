import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/logout', AuthController.logout);
AuthRouter.post('/refreshToken', AuthController.refreshToken);

export default AuthRouter;
