import { Router } from 'express';
import PaypalController from '../controllers/paypal.controller';

const router = Router();

router.post('/createorder', PaypalController.createOrder);
router.post('/captureorder', PaypalController.captureOrder);

export default router;
