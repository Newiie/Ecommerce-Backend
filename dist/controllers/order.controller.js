"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = __importDefault(require("../services/order.service"));
const mongodb_order_repository_1 = require("../repositories/Order/mongodb.order.repository");
const mongodb_product_repository_1 = require("../repositories/Product/mongodb.product.repository");
const AppError_1 = __importDefault(require("../utils/AppError"));
class OrderController {
    orderService;
    constructor() {
        const mongoDbOrderRepository = new mongodb_order_repository_1.MongoDbOrderRepository();
        const mongoDbProductRepository = new mongodb_product_repository_1.MongoDbProductRepository();
        this.orderService = new order_service_1.default(mongoDbOrderRepository, mongoDbProductRepository);
    }
    createOrder = async (req, res, next) => {
        try {
            const { userId, products } = req.body;
            const order = await this.orderService.createOrder(userId, products);
            res.status(201).json(order);
        }
        catch (error) {
            next(error);
        }
    };
    getOrderById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrderById(id);
            res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    };
    updateOrderStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (req.role !== 'admin') {
                throw new AppError_1.default('Unauthorized', 403);
            }
            const updatedOrder = await this.orderService.updateOrderStatus(id, status);
            res.status(200).json(updatedOrder);
        }
        catch (error) {
            next(error);
        }
    };
    deleteOrder = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (req.role !== 'admin') {
                throw new AppError_1.default('Unauthorized', 403);
            }
            const deletedOrder = await this.orderService.deleteOrder(id);
            res.status(200).json(deletedOrder);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new OrderController();
