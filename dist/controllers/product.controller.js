"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_product_repository_1 = require("../repositories/Product/mongodb.product.repository");
const product_service_1 = __importDefault(require("../services/product.service"));
const logger_1 = __importDefault(require("../utils/logger"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class ProductController {
    productService;
    constructor() {
        const mongoDbProductRepository = new mongodb_product_repository_1.MongoDbProductRepository();
        this.productService = new product_service_1.default(mongoDbProductRepository);
    }
    getProduct = async (req, res, next) => {
        try {
            const product = await this.productService.getProductById(req.params.id);
            res.status(200).send(product);
        }
        catch (error) {
            next(error);
        }
    };
    getAllProduct = async (req, res, next) => {
        try {
            const product = await this.productService.getAllProduct();
            res.status(200).send(product);
        }
        catch (error) {
            next(error);
        }
    };
    createProduct = async (req, res, next) => {
        try {
            if (req.role !== 'admin') {
                throw new AppError_1.default('Unauthorized', 403);
            }
            const productData = req.body;
            if (!productData.name) {
                res.status(400).send({ message: 'Product name is required' });
                return;
            }
            const files = req.files;
            if (files && files['productImage']) {
                productData.productImage = files['productImage'][0].buffer;
            }
            if (files['variationImages']) {
                files['variationImages'].forEach((file, index) => {
                    if (productData.variations[index]) {
                        productData.variations[index].productImage = file.buffer;
                    }
                });
            }
            const product = await this.productService.createProduct(productData);
            res.status(201).send(product);
        }
        catch (error) {
            logger_1.default.error(error);
            next(error);
        }
    };
    updateProduct = async (req, res, next) => {
        try {
            if (req.role !== 'admin') {
                throw new AppError_1.default("You are not authorized to update this product", 403);
            }
            const productData = req.body;
            if (req.file) {
                productData.productImage = req.file.buffer;
            }
            const product = await this.productService.updateProduct(req.params.id, productData);
            if (!product) {
                res.status(404).send({ message: 'Product not found' });
                return;
            }
            res.status(200).send(product);
        }
        catch (error) {
            next(error);
        }
    };
    deleteProduct = async (req, res, next) => {
        try {
            if (req.role !== 'admin') {
                throw new AppError_1.default("You are not authorized to delete this product", 403);
            }
            const product = await this.productService.deleteProduct(req.params.id);
            if (!product) {
                res.status(404).send({ message: 'Product not found' });
                return;
            }
            res.status(200).send({ message: 'Product deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new ProductController();
