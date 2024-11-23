"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError_1.default(`Product with ID ${id} not found.`, 404);
        }
        return product;
    }
    async getAllProduct() {
        try {
            const products = await this.productRepository.getAllProduct();
            return products;
        }
        catch (error) {
            throw error;
        }
    }
    async createProduct(productData) {
        return await this.productRepository.save(productData);
    }
    async updateProduct(id, productData) {
        const updatedProduct = await this.productRepository.update(id, productData);
        if (!updatedProduct) {
            throw new AppError_1.default(`Product with ID ${id} not found.`, 404);
        }
        return updatedProduct;
    }
    async deleteProduct(id) {
        const deletedProduct = await this.productRepository.delete(id);
        if (!deletedProduct) {
            throw new AppError_1.default(`Product with ID ${id} not found.`, 404);
        }
        return deletedProduct;
    }
}
exports.default = ProductService;
