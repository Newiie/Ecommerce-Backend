import { NextFunction, Request, Response } from 'express';
import { MongoDbProductRepository } from '../repositories/Product/mongodb.product.repository';
import ProductService from '../services/product.service';
import logger from '../utils/logger';

class ProductController {
    private productService: ProductService;

    constructor() {
        const mongoDbProductRepository = new MongoDbProductRepository();
        this.productService = new ProductService(mongoDbProductRepository);
    }

    public getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const product = await this.productService.getProductById(req.params.id);
            res.status(200).send(product);
        } catch (error) {
            next(error);
        }
    };

    public getAllProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const product = await this.productService.getAllProduct();
            res.status(200).send(product);
        } catch (error) {
            next(error);
        }
    };

    public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const productData = req.body;
            if (!productData.name) {
                res.status(400).send({ message: 'Product name is required' });
                return;
            }
            if (req.file) {
                productData.productImage = req.file.buffer; // Store the binary data
            }
            const product = await this.productService.createProduct(productData);
            res.status(201).send(product);
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const productData = req.body;
            if (req.file) {
                productData.productImage = req.file.buffer; // Store the binary data
            }
            const product = await this.productService.updateProduct(req.params.id, productData);
            if (!product) {
                res.status(404).send({ message: 'Product not found' });
                return;
            }
            res.status(200).send(product);
        } catch (error) {
            next(error);
        }
    };

    public deleteProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await this.productService.deleteProduct(req.params.id);
            if (!product) {
                res.status(404).send({ message: 'Product not found' });
                return;
            }
            res.status(200).send({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).send({ message: 'Failed to delete product', error });
        }
    };
}

export default new ProductController();
