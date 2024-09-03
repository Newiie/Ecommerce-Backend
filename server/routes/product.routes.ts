import express from 'express';
import { getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const productRouter = express.Router();

productRouter.get('/products/:id', getProduct);    // Fetch a specific product by ID
productRouter.post('/products', createProduct);    // Create a new product
productRouter.put('/products/:id', updateProduct); // Update a specific product by ID
productRouter.delete('/products/:id', deleteProduct); // Delete a specific product by ID

export default productRouter;
