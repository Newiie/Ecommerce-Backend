"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../controllers/order.controller"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const orderRouter = (0, express_1.Router)();
// orderRouter.post('/', middleware.jwtAuth, OrderController.createOrder);
orderRouter.get('/:id', middleware_1.default.jwtAuth(['admin', 'user']), order_controller_1.default.getOrderById);
orderRouter.put('/:id', middleware_1.default.jwtAuth(['admin']), order_controller_1.default.updateOrderStatus);
orderRouter.delete('/:id', middleware_1.default.jwtAuth(['admin']), order_controller_1.default.deleteOrder);
exports.default = orderRouter;
