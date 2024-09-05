import User, {IUser} from '../../models/user.model';
import { IUserRepository } from './user.repository.interface';
import mongoose from 'mongoose';

class mongoDbUserRepository implements IUserRepository {
    
    // Method to find a user by username
    public async findByUsername(username: string) : Promise<IUser | null> {
        return await User.findOne({ username });
    }

    public async findById(userId: string) : Promise<IUser | null> {
        return await User.findById(userId)
    }

    // Method to create a new user
    public async createUser(userData: any) : Promise<IUser | null> {
        const user = new User(userData);
        return await user.save();
    }

    // Method to find all users
    public async findAllUsers() : Promise<IUser[] | null> {
        return await User.find({});
    }

   // Method to update a user
    public async updateUser(user: IUser): Promise<IUser | null> {
        return await user.save();
    }

     // Method to add or update a product in the user's cart
     public async addOrUpdateCart(userId: string, productId: string, quantity: number): Promise<void> {
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const updateResult = await User.updateOne(
            { _id: userId, "cart.product": productObjectId },
            { $inc: { "cart.$.quantity": quantity } }
        );

        // If no item was updated (i.e., the product was not already in the cart), add it
        if (updateResult.matchedCount === 0) {
            await User.updateOne(
                { _id: userId },
                { $push: { cart: { product: productObjectId, quantity } } }
            );
        }
    }

    // Method to remove a product from the cart
    public async removeFromCart(userId: string, productId: string): Promise<void> {
        const productObjectId = new mongoose.Types.ObjectId(productId);
        await User.updateOne(
            { _id: userId },
            { $pull: { cart: { product: productObjectId } } }
        );
    }

    // Method to clear the cart
    public async clearCart(userId: string): Promise<void> {
        await User.updateOne(
            { _id: userId },
            { $set: { cart: [] } }
        );
    }
}

export default mongoDbUserRepository;
