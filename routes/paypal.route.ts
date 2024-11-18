import { Router } from 'express';
import PaypalController from '../controllers/paypal.controller';
import middleware from '../utils/middleware';
const router = Router();

router.post('/create-order', middleware.jwtAuth(['user', 'admin']), PaypalController.createOrder);
router.post('/capture-order', middleware.jwtAuth(['user', 'admin']), PaypalController.captureOrder);

export default router;
