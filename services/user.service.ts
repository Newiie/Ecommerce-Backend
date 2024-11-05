import User from '../models/user.model';
import { IProductRepository } from '../repositories/Product/product.repository';
import UserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError';
import { ICartItem, IProductVariation, IUser } from '../utils/types';

class UserService {
    
    private userRepository: IUserRepository;
    private productRepository: IProductRepository;
    constructor(userRepository: IUserRepository, productRepository: IProductRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    
    public async createUser(username: string, name: string, password: string): Promise<IUser | null> {
        const passwordHash = await bcrypt.hash(password, 10);
        const userData = { username, name, passwordHash };
        
        return await this.userRepository.createUser(userData);
    }

    // TEST FUNCTION
    public async getAllUsers(): Promise<IUser[] | null> {
        return await this.userRepository.findAllUsers();
    }

    public async addToCart(userId: string, productId: string, quantity: number): Promise<IUser | null> {
        const product = await this.productRepository.findById(productId)
        // const productVariation = product?.variations.find((variation: IProductVariation) => variation.variationId.toString() === productId);

        // if(!productVariation) {
        //     throw new AppError("Product variation not found", 404);
        // }

        // if (!productVariation.stock) {
        //     throw new AppError("Product out of stock", 404);
        // }

        if (!product) {
            throw new AppError("Product not found", 404);
        }
        await this.userRepository.addOrUpdateCart(userId, productId, quantity);
        return await this.userRepository.findById(userId); 
    }

    public async removeFromCart(userId: string, productId: string): Promise<IUser | null> {
        const product = await this.productRepository.findById(productId)
        if (!product) {
            throw new AppError("Product not found", 404);
        }
        await this.userRepository.removeFromCart(userId, productId);
        return await this.userRepository.findById(userId); 
    }

    public async clearCart(userId: string): Promise<IUser | null> {
        await this.userRepository.clearCart(userId);
        console.log("CLEAR CART ", await this.userRepository.findById(userId))
        return await this.userRepository.findById(userId);  
    }

    public async checkout(userId: string): Promise<IUser | null> {
        await this.userRepository.checkout(userId);
        return await this.userRepository.findById(userId);  
    }   

    public async getCart(userId: string): Promise<ICartItem[]> {
        const cartData = await this.userRepository.getCart(userId);
        if (!cartData) {
            throw new AppError("CartData not found", 404);
        }
        console.log("CART DATA ", cartData)
        const cartItems: ICartItem[] = cartData.map((item: any) => {
            const product = item.product;
            return {
                id: item._id,
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.basePrice,
                productImage: product.productImage,
            };
        });
        console.log("CART ITEMS ", cartItems)
        return cartItems;
    }
}

export default UserService;
