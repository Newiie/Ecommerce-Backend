import { Router } from 'express';
import ProductController from '../controllers/product.controller';

const router = Router();

router.get('/:id', ProductController.getProduct);
router.get('/', ProductController.getAllProduct);
router.post('', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;
