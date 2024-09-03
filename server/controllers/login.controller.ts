import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
class LoginController {
    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        const result = await AuthService.authenticateUser(username, password);

        if (result.error) {
            return res.status(401).json({ error: result.error });
        }

        res.status(200).send({
            token: result.token,
            username: result.username,
            name: result.name
        });
    }
}

export default new LoginController();
