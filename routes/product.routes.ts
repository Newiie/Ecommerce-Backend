import { Router } from 'express';
import multer from 'multer';
import ProductController from '../controllers/product.controller';
import middleware from '../utils/middleware';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', ProductController.getProduct);
router.get('/', ProductController.getAllProduct);
router.post('', middleware.jwtAuth, upload.single('productImage'), ProductController.createProduct); 
router.put('/:id', middleware.jwtAuth, upload.single('productImage'), ProductController.updateProduct); 
router.delete('/:id', middleware.jwtAuth, ProductController.deleteProduct);

export default router;
