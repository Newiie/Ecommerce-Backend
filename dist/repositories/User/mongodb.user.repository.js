"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../../models/product.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const mongodb_product_repository_1 = require("../Product/mongodb.product.repository");
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDbUserRepository {
    productRepository;
    constructor() {
        this.productRepository = new mongodb_product_repository_1.MongoDbProductRepository();
    }
    async findByUsername(username) {
        return await user_model_1.default.findOne({ username });
    }
    async findById(userId) {
        return await user_model_1.default.findById(userId);
    }
    async createUser(userData) {
        const user = new user_model_1.default(userData);
        if (userData.username === 'admin@admin.com') {
            user.role = 'admin';
        }
        return await user.save();
    }
    async findAllUsers() {
        return await user_model_1.default.find({});
    }
    async updateUser(user) {
        return await user.save();
    }
    async addOrUpdateCart(userId, productId, quantity) {
        const productObjectId = new mongoose_1.default.Types.ObjectId(productId);
        const updateResult = await user_model_1.default.updateOne({ _id: userId, "cart.product": productObjectId }, { $inc: { "cart.$.quantity": quantity } });
        if (updateResult.matchedCount === 0) {
            await user_model_1.default.updateOne({ _id: userId }, { $push: { cart: { product: productObjectId, quantity } } });
        }
    }
    async removeFromCart(userId, productId) {
        const productObjectId = new mongoose_1.default.Types.ObjectId(productId);
        await user_model_1.default.updateOne({ _id: userId }, { $pull: { cart: { product: productObjectId } } });
    }
    async clearCart(userId) {
        const user = await user_model_1.default.findById(userId);
        console.log("user", user);
        await user_model_1.default.updateOne({ _id: userId }, { $set: { cart: [] } });
    }
    async checkout(userId) {
        await user_model_1.default.updateOne({ _id: userId }, { $set: { cart: [] } });
    }
    async categorizeIds(user) {
        const productIds = [];
        const variationIds = [];
        for (const item of user.cart) {
            try {
                const productExists = await product_model_1.default.findById(item.product);
                if (productExists) {
                    productIds.push({ product: item.product, quantity: item.quantity });
                }
                else {
                    const variationExists = await this.productRepository.findVariationById(item.product);
                    if (variationExists) {
                        variationIds.push({ product: item.product, quantity: item.quantity });
                    }
                    else {
                        console.log(`ID ${item.product} does not match any product or variation`);
                    }
                }
            }
            catch (error) {
                console.error(`Error fetching product/variation ID ${item.product}:`, error);
            }
        }
        return { productIds, variationIds };
    }
    async getCart(userId) {
        const user = await user_model_1.default.findById(userId).lean();
        if (!user || !user.cart)
            return [];
        const { productIds, variationIds } = await this.categorizeIds(user);
        console.log("PRODUCT IDS: ", productIds);
        console.log("VARIATION IDS: ", variationIds);
        const productCart = await Promise.all(productIds.map(async (productId) => {
            const product = await this.productRepository.findById(productId.product);
            return {
                ...product,
                quantity: productId.quantity
            };
        }));
        const variationCart = await Promise.all(variationIds.map(async (variationId) => {
            const variation = await this.productRepository.findVariationById(variationId.product);
            return {
                ...variation,
                quantity: variationId.quantity
            };
        }));
        return [...productCart, ...variationCart];
    }
}
exports.default = MongoDbUserRepository;
