import { NextFunction, Request, Response } from 'express';
import PaypalService from '../services/paypal.service';
import { MongoDbOrderRepository } from '../repositories/Order/mongodb.order.repository';
import { MongoDbProductRepository } from '../repositories/Product/mongodb.product.repository';
import MongoDbUserRepository from '../repositories/User/mongodb.user.repository';

class PaypalController {
    private paypalService: PaypalService;

    constructor() {
        const mongoDbOrderRepository = new MongoDbOrderRepository();
        const mongoDbProductRepository = new MongoDbProductRepository();
        const mongoDbUserRepository = new MongoDbUserRepository();

        this.paypalService = new PaypalService(mongoDbOrderRepository, mongoDbProductRepository, mongoDbUserRepository);
    }

    public createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currency } = req.body;
            const order = await this.paypalService.createOrder(req.id as string, currency);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    };

    public captureOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderID } = req.body;
            const order = await this.paypalService.captureOrder(orderID, req.id as string);
            console.log("ORDER CAPTURE: ", order);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }
}

export default new PaypalController();
