import { NextFunction, Request, Response } from 'express';
import { MongoDbProductRepository } from '../repositories/Product/mongodb.product.repository';
import ProductService from '../services/product.service';
import logger from '../utils/logger';
import AppError from '../utils/AppError';


class ProductController {
    private productService: ProductService;

    constructor() {
        const mongoDbProductRepository = new MongoDbProductRepository();
        this.productService = new ProductService(mongoDbProductRepository);
    }

    public getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const product = await this.productService.getProductById(req.params.id);
            console.log("PRODUCT: ", product);
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

            if (req.role !== 'admin') {
                throw new AppError('Unauthorized', 403);
            }

            const productData = req.body;

            if (!productData.name) {
                res.status(400).send({ message: 'Product name is required' });
                return;
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

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
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };

    public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.role !== 'admin') {
                throw new AppError("You are not authorized to update this product", 403);
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
        } catch (error) {
            next(error);
        }
    };

    public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.role !== 'admin') {
                throw new AppError("You are not authorized to delete this product", 403);
            }

            const product = await this.productService.deleteProduct(req.params.id);
            if (!product) {
                res.status(404).send({ message: 'Product not found' });
                return;
            }
            res.status(200).send({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error)
        }
    };
}

export default new ProductController();
