"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class UserService {
    userRepository;
    productRepository;
    constructor(userRepository, productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    async createUser(username, name, password) {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const userData = { username, name, passwordHash };
        return await this.userRepository.createUser(userData);
    }
    async getUser(userId) {
        return await this.userRepository.findById(userId);
    }
    // TEST FUNCTION
    async getAllUsers() {
        return await this.userRepository.findAllUsers();
    }
    async addToCart(userId, productId, quantity) {
        const product = await this.productRepository.findById(productId);
        const productVariation = await this.productRepository.findVariationById(productId);
        console.log("PRODUCT VARIATION: ", productVariation);
        if (!productVariation && !product) {
            throw new AppError_1.default("Product not found", 404);
        }
        // if (productVariation && productVariation.stock < quantity) {
        //     throw new AppError("Insufficient stock for the selected variation", 404);
        // }
        await this.userRepository.addOrUpdateCart(userId, productId, quantity);
        return await this.userRepository.findById(userId);
    }
    async removeFromCart(userId, productId) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new AppError_1.default("Product not found", 404);
        }
        await this.userRepository.removeFromCart(userId, productId);
        return await this.userRepository.findById(userId);
    }
    async clearCart(userId) {
        await this.userRepository.clearCart(userId);
        return await this.userRepository.findById(userId);
    }
    async checkout(userId) {
        await this.userRepository.checkout(userId);
        return await this.userRepository.findById(userId);
    }
    async getCart(userId) {
        const cartData = await this.userRepository.getCart(userId);
        if (!cartData) {
            throw new AppError_1.default("CartData not found", 404);
        }
        // console.log("CART DATA ", cartData)
        const cartItems = cartData.map((item) => {
            const product = item;
            // console.log("PRODUCT ", product)
            return {
                productId: product._id.toString(),
                name: product?.name || product?.variationName,
                quantity: item.quantity,
                price: product?.basePrice,
                productImage: product?.productImage,
            };
        });
        // console.log("CART ITEMS ", cartItems)
        return cartItems;
    }
}
exports.default = UserService;
