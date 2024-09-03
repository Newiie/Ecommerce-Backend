import bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository';

class UserService {
    // Method to create a new user
    public async createUser(username: string, name: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);
        const userData = { username, name, passwordHash };
        return await UserRepository.createUser(userData);
    }

    // Method to get all users
    public async getAllUsers() {
        return await UserRepository.findAllUsers();
    }
}

export default new UserService();
