import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
class LoginController {

    public authService: AuthService;
    constructor() {
        this.authService = new AuthService;
    }

    public login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const result = await this.authService.authenticateUser(username, password);

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
