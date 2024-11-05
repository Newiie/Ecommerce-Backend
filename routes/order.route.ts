import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import middleware from '../utils/middleware';

const orderRouter = Router();

// orderRouter.post('/', middleware.jwtAuth, OrderController.createOrder);
orderRouter.get('/:id', middleware.jwtAuth, OrderController.getOrderById);
orderRouter.put('/:id', middleware.jwtAuth, OrderController.updateOrderStatus);
orderRouter.delete('/:id', middleware.jwtAuth, OrderController.deleteOrder);

export default orderRouter;
