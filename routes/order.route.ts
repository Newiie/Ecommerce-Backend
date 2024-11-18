import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import middleware from '../utils/middleware';

const orderRouter = Router();

// orderRouter.post('/', middleware.jwtAuth, OrderController.createOrder);
orderRouter.get('/:id', middleware.jwtAuth(['admin', 'user']), OrderController.getOrderById);
orderRouter.put('/:id', middleware.jwtAuth(['admin']), OrderController.updateOrderStatus);
orderRouter.delete('/:id', middleware.jwtAuth(['admin']), OrderController.deleteOrder);

export default orderRouter;
