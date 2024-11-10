import { Router } from 'express';
import multer from 'multer';
import ProductController from '../controllers/product.controller';
import middleware from '../utils/middleware';
const router = Router();

const upload = multer({ storage: multer.memoryStorage() }).fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'variationImages', maxCount: 10 }, 
]);

router.get('/:id', ProductController.getProduct);
router.get('/', ProductController.getAllProduct);
router.post('/', middleware.jwtAuth, upload, ProductController.createProduct);
router.put('/:id', middleware.jwtAuth, upload, ProductController.updateProduct);
router.delete('/:id', middleware.jwtAuth, ProductController.deleteProduct);

export default router;
