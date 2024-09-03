import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) return res.status(404).send({ message: 'Product not found' });
        res.send(product);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ message: 'Failed to create product', error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).send({ message: 'Product not found' });
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: 'Failed to update product', error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await ProductService.deleteProduct(req.params.id);
        if (!product) return res.status(404).send({ message: 'Product not found' });
        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete product', error });
    }
};
