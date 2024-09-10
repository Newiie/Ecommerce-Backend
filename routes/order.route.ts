import { Router } from 'express';
import OrderController from '../controllers/order.controller';

const orderRouter = Router();

orderRouter.post('/', OrderController.createOrder);
orderRouter.get('/:id', OrderController.getOrderById);
orderRouter.put('/', OrderController.updateOrderStatus);
orderRouter.get('/', OrderController.deleteOrder);

export default orderRouter;
