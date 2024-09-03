import User from '../models/user.model';

class UserRepository {
    // Method to find a user by username
    public async findByUsername(username: string) {
        return await User.findOne({ username });
    }

    // Method to create a new user
    public async createUser(userData: any) {
        const user = new User(userData);
        return await user.save();
    }

    // Method to find all users
    public async findAllUsers() {
        return await User.find({});
    }
}

export default new UserRepository();
