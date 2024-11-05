import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/order.service';
import { MongoDbOrderRepository } from '../repositories/Order/mongodb.order.repository';
import { MongoDbProductRepository } from '../repositories/Product/mongodb.product.repository';
import AppError from '../utils/AppError';

class OrderController {
  private orderService: OrderService;

  constructor() {
    const mongoDbOrderRepository = new MongoDbOrderRepository();
    const mongoDbProductRepository = new MongoDbProductRepository();
    this.orderService = new OrderService(mongoDbOrderRepository, mongoDbProductRepository);
  }

  public createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, products } = req.body;
      const order = await this.orderService.createOrder(userId, products);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };

  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (req.role !== 'admin') {
        throw new AppError('Unauthorized', 403);
      }

      const updatedOrder = await this.orderService.updateOrderStatus(id, status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (req.role !== 'admin') {
        throw new AppError('Unauthorized', 403);
      }

      const deletedOrder = await this.orderService.deleteOrder(id);
      res.status(200).json(deletedOrder);
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
