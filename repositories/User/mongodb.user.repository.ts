import User from '../../models/user.model';
import { IUser } from '../../utils/types';
import { IUserRepository } from './user.repository.interface';
import mongoose from 'mongoose';

class MongoDbUserRepository implements IUserRepository {
    
    public async findByUsername(username: string) : Promise<IUser | null> {
        return await User.findOne({ username });
    }

    public async findById(userId: string) : Promise<IUser | null> {
        return await User.findById(userId)
    }

    public async createUser(userData: any) : Promise<IUser | null> {
        const user = new User(userData);
        if (userData.username === 'admin@admin.com') {
            user.role = 'admin';
        }
        
        return await user.save();
    }

    public async findAllUsers() : Promise<IUser[] | null> {
        return await User.find({});
    }

    public async updateUser(user: IUser): Promise<IUser | null> {
        return await user.save();
    }

     public async addOrUpdateCart(userId: string, productId: string, quantity: number): Promise<void> {
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const updateResult = await User.updateOne(
            { _id: userId, "cart.product": productObjectId },
            { $inc: { "cart.$.quantity": quantity } }
        );

        if (updateResult.matchedCount === 0) {
            await User.updateOne(
                { _id: userId },
                { $push: { cart: { product: productObjectId, quantity } } }
            );
        }
    }

    public async removeFromCart(userId: string, productId: string): Promise<void> {
        const productObjectId = new mongoose.Types.ObjectId(productId);
        await User.updateOne(
            { _id: userId },
            { $pull: { cart: { product: productObjectId } } }
        );
    }

    public async clearCart(userId: string): Promise<void> {
        const user = await User.findById(userId);
        console.log("user", user)
        
        await User.updateOne(
            { _id: userId },
            { $set: { cart: [] } }
        );
    }

    public async checkout(userId: string): Promise<void> {
        await User.updateOne(
            { _id: userId },
            { $set: { cart: [] } }
        );
    }

    public async getCart(userId: string): Promise<any> {
        const user = await User.findById(userId).populate('cart.product');
        return user?.cart;
    }

}

export default MongoDbUserRepository;
