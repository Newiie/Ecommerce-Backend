import Product from '../../models/product.model';
import User from '../../models/user.model';
import { IUser } from '../../utils/types';
import { IUserRepository } from './user.repository.interface';
import { MongoDbProductRepository } from '../Product/mongodb.product.repository';
import mongoose from 'mongoose';

class MongoDbUserRepository implements IUserRepository {
    
    private productRepository: MongoDbProductRepository;

    constructor() {
        this.productRepository = new MongoDbProductRepository();
    }

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

    private async categorizeIds(user: any) {
        const productIds: {product: string, quantity: number}[] = [];
        const variationIds: {product: string, quantity: number}[] = [];
    
        for (const item of user.cart) {
            try {
                const productExists = await Product.findById(item.product);
                if (productExists) {
                    productIds.push({product: item.product, quantity: item.quantity});
                } else {
                    const variationExists = await this.productRepository.findVariationById(item.product);
                    if (variationExists) {
                        variationIds.push({product: item.product, quantity: item.quantity});
                    } else {
                        console.log(`ID ${item.product} does not match any product or variation`);
                    }
                }
            } catch (error) {
                console.error(`Error fetching product/variation ID ${item.product}:`, error);
            }
        }
    
        return { productIds, variationIds };
    }

    public async getCart(userId: string): Promise<any> {
        const user = await User.findById(userId).lean();
        if (!user || !user.cart) return [];
    
        const { productIds, variationIds } = await this.categorizeIds(user);
        
        console.log("PRODUCT IDS: ", productIds)
        console.log("VARIATION IDS: ", variationIds)

        const productCart = await Promise.all(productIds.map(async (productId) => {
            const product = await this.productRepository.findById(productId.product);
            return {
                ...product,
                quantity: productId.quantity
            }
        }));

        const variationCart = await Promise.all(variationIds.map(async (variationId) => {
            const variation = await this.productRepository.findVariationById(variationId.product);
            return {
                ...variation,
                quantity: variationId.quantity
            }
        }));


        return [...productCart, ...variationCart];
    }
    

}

export default MongoDbUserRepository;
