"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbOrderRepository = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
class MongoDbOrderRepository {
    async createOrder(orderData) {
        const order = new order_model_1.default(orderData);
        return await order.save();
    }
    async findOrderById(id) {
        return await order_model_1.default.findById(id).populate('products.product').populate('user');
    }
    async updateOrderStatus(id, status) {
        return await order_model_1.default.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
    }
    async deleteOrder(id) {
        return await order_model_1.default.findByIdAndDelete(id);
    }
    async some() {
        return;
    }
}
exports.MongoDbOrderRepository = MongoDbOrderRepository;
