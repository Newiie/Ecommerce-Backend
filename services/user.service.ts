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

    public async getUser(userId: string): Promise<IUser | null> {
        return await this.userRepository.findById(userId);
    }

    public async getAllUsers(): Promise<IUser[] | null> {
        return await this.userRepository.findAllUsers();
    }

    public async addToCart(userId: string, productId: string, quantity: number): Promise<IUser | null> {
        const product = await this.productRepository.findById(productId)

        const productVariation = await this.productRepository.findVariationById(productId);

        console.log("PRODUCT VARIATION: ", productVariation)
        if(!productVariation && !product) {
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

        const cartItems: ICartItem[] = cartData.map((item: any) => {
            const product = item;
       
            return {
                productId: product._id.toString(),
                name: product?.name || product?.variationName,
                quantity: item.quantity,
                price: product?.basePrice,
                productImage: product?.productImage,
            };
        });
    
        return cartItems;
    }
}

export default UserService;
