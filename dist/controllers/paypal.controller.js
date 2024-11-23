"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paypal_service_1 = __importDefault(require("../services/paypal.service"));
const mongodb_order_repository_1 = require("../repositories/Order/mongodb.order.repository");
const mongodb_product_repository_1 = require("../repositories/Product/mongodb.product.repository");
const mongodb_user_repository_1 = __importDefault(require("../repositories/User/mongodb.user.repository"));
class PaypalController {
    paypalService;
    constructor() {
        const mongoDbOrderRepository = new mongodb_order_repository_1.MongoDbOrderRepository();
        const mongoDbProductRepository = new mongodb_product_repository_1.MongoDbProductRepository();
        const mongoDbUserRepository = new mongodb_user_repository_1.default();
        this.paypalService = new paypal_service_1.default(mongoDbOrderRepository, mongoDbProductRepository, mongoDbUserRepository);
    }
    createOrder = async (req, res, next) => {
        try {
            const { currency } = req.body;
            const order = await this.paypalService.createOrder(req.id, currency);
            res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    };
    captureOrder = async (req, res, next) => {
        try {
            const { orderID } = req.body;
            const order = await this.paypalService.captureOrder(orderID, req.id);
            res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new PaypalController();
