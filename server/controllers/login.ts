import { Router, Request, Response } from 'express';
import { authenticateUser } from '../services/authService';

const loginRouter = Router();

loginRouter.post('/', async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const result = await authenticateUser(username, password);

  if (result.error) {
    return response.status(401).json({ error: result.error });
  }

  response.status(200).send({
    token: result.token,
    username: result.username,
    name: result.name
  });
});

export default loginRouter;
