import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user";

interface AuthResult {
  error?: string;
  token?: string;
  username?: string;
  name?: string;
}

export const authenticateUser = async (username: string, password: string): Promise<AuthResult> => {
  const user = await User.findOne({ username });
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
};
