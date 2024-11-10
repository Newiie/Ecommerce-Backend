import { IProductRepository } from '../repositories/Product/product.repository';
import AppError from '../utils/AppError';
import Product from '../models/product.model';
import { Request, Response, NextFunction } from 'express';

class ProductService {
    private productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    public async getProductById(id: string) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError(`Product with ID ${id} not found.`, 404);
        }

        return product;
    }

    public async getAllProduct() {
        try {
            const products = await this.productRepository.getAllProduct();
            const productsWithoutImages = products.map((product: any) => {
                const { productImage, ...rest } = product;
                return rest;
            });
            console.log("PRODUCTS WITHOUT IMAGES: ", productsWithoutImages);
            return productsWithoutImages;
        } catch (error) {
            throw error;
        }
    }

    public async createProduct(productData: any) {
        return await this.productRepository.save(productData);
    }

    public async updateProduct(id: string, productData: any) {
        const updatedProduct = await this.productRepository.update(id, productData);

        if (!updatedProduct) {
            throw new AppError(`Product with ID ${id} not found.`, 404);
        }

        return updatedProduct;
    }

    public async deleteProduct(id: string) {
        const deletedProduct = await this.productRepository.delete(id);

        if (!deletedProduct) {
            throw new AppError(`Product with ID ${id} not found.`, 404);
        }

        return deletedProduct;
    }
}

export default ProductService;
