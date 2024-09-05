import UserService from '../../services/user.service';
import { IUser } from '../../models/user.model';
import { IUserRepository } from '../../repositories/User/user.repository.interface';
import mongoose from 'mongoose';  // Ensure we're importing mongoose for ObjectId

jest.mock('bcrypt');

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<Partial<IUserRepository>>;

    beforeEach(() => {
        mockUserRepository = {
            createUser: jest.fn() as jest.Mock,
            findAllUsers: jest.fn() as jest.Mock,
            addOrUpdateCart: jest.fn() as jest.Mock,
            findById: jest.fn() as jest.Mock,
        };
        userService = new UserService(mockUserRepository as IUserRepository);
    });

    // Complex test case for adding a product to the user's cart and verifying the cart is updated
    it('should add a product to the user\'s cart and return the updated user', async () => {
        const userId = 'user123';
        const productId = new mongoose.Types.ObjectId(); // Correctly use mongoose.Types.ObjectId
        const quantity = 2;
    
        // Simulate a user object before adding to the cart
        const mockUserBefore: Partial<IUser> = { 
            _id: userId, 
            username: 'john_doe', 
            name: 'John Doe', 
            passwordHash: 'hashedPassword123', 
            cart: [], 
            orderHistory: [] 
        };
    
        // Simulate the user object after adding the product to the cart
        const mockUserAfter: Partial<IUser> = { 
            _id: userId, 
            username: 'john_doe', 
            name: 'John Doe', 
            passwordHash: 'hashedPassword123', 
            cart: [
                { product: productId.toString(), quantity }  // Use product (ObjectId) field instead of productId
            ], 
            orderHistory: [] 
        };
    
        // Mock findById to return the user before adding to the cart
        (mockUserRepository.findById as jest.Mock).mockResolvedValueOnce(mockUserBefore as IUser);
    
        // Mock addOrUpdateCart to simulate successful product addition
        (mockUserRepository.addOrUpdateCart as jest.Mock).mockResolvedValue(null);
    
        // Mock findById to return the user after updating the cart
        (mockUserRepository.findById as jest.Mock).mockResolvedValueOnce(mockUserAfter as IUser);
    
        // Call the method to test
        const result = await userService.addToCart(userId, productId.toString(), quantity);
    
        // Expectations
        expect(mockUserRepository.addOrUpdateCart).toHaveBeenCalledWith(userId, productId.toString(), quantity);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockUserAfter);  // Should now return mockUserAfter
    });
    

    // Complex test case for handling the case when user is not found when adding to cart
    it('should return null if the user is not found when adding to cart', async () => {
        const userId = 'nonExistentUserId';
        const productId = new mongoose.Types.ObjectId(); // Simulate a MongoDB ObjectId for the product
        const quantity = 2;

        // Mock findById to return null, simulating a user not found
        (mockUserRepository.findById as jest.Mock).mockResolvedValueOnce(null);

        // Call the method to test
        const result = await userService.addToCart(userId, productId.toString(), quantity);

        // Expectations
        expect(mockUserRepository.addOrUpdateCart).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });
});
