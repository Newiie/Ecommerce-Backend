"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const mongodb_user_repository_1 = __importDefault(require("../repositories/User/mongodb.user.repository"));
const mongodb_product_repository_1 = require("../repositories/Product/mongodb.product.repository");
class UserController {
    userService;
    constructor() {
        const mongoDbUserRepository = new mongodb_user_repository_1.default();
        const mongoDbProductRepository = new mongodb_product_repository_1.MongoDbProductRepository();
        this.userService = new user_service_1.default(mongoDbUserRepository, mongoDbProductRepository);
    }
    createUser = async (req, res) => {
        const { username, name, password } = req.body;
        if (!username || !password) {
            console.log('Validation failed: Username or password missing');
            return res.status(400).json({ error: 'Username and password are required' });
        }
        try {
            const savedUser = await this.userService.createUser(username, name, password);
            res.status(201).json(savedUser);
        }
        catch (error) {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    };
    getUser = async (req, res) => {
        try {
            const user = await this.userService.getUser(req.id);
            res.status(200).json(user);
        }
        catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    };
    updateUser = async (req, res) => {
        const { username, name, password } = req.body;
        const { id } = req.params;
        if (!id || (!username && !name && !password)) {
            return res.status(400).json({ error: 'Missing user ID or data to update' });
        }
        try {
            // const updatedUser = await this.userService.updateUser(id, { username, name, password });
            // if (!updatedUser) {
            //     return res.status(404).json({ error: 'User not found' });
            // }
            // res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    };
    deleteUser = async (req, res) => {
        const { id } = req.params;
        if (req.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        try {
            // const deletedUser = await this.userService.deleteUser(id);
            // if (!deletedUser) {
            //     return res.status(404).json({ error: 'User not found' });
            // }
            res.status(200).json({ message: 'User deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    };
    // Add a product to the user's cart
    addToCart = async (req, res, next) => {
        const { productId, quantity } = req.body;
        console.log("ADD TO CART PARAMS: ", productId, quantity);
        try {
            const updatedUser = await this.userService.addToCart(req.id, productId, quantity);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error adding product to cart:', error);
            next(error);
        }
    };
    // Remove a product from the user's cart
    removeFromCart = async (req, res, next) => {
        const { productId } = req.body;
        try {
            const updatedUser = await this.userService.removeFromCart(req.id, productId);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error removing product from cart:', error);
            next(error);
        }
    };
    // Clear the user's cart
    clearCart = async (req, res) => {
        try {
            const updatedUser = await this.userService.clearCart(req.id);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ error: 'Failed to clear cart' });
        }
    };
    checkout = async (req, res) => {
        const { userId } = req.body;
        try {
            const updatedUser = await this.userService.checkout(userId);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error checking out:', error);
            res.status(500).json({ error: 'Failed to checkout' });
        }
    };
    getCart = async (req, res) => {
        try {
            const updatedUser = await this.userService.getCart(req.id);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ error: 'Failed to get cart' });
        }
    };
}
exports.default = new UserController();
