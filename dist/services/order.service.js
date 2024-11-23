"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
class OrderService {
    orderRepository;
    productRepository;
    constructor(orderRepository, productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    async createOrder(userId, products) {
        let totalAmount = 0;
        try {
            const productDetails = [];
            for (const item of products) {
                const product = await this.productRepository.findById(item.productId);
                if (!product) {
                    throw new AppError_1.default(`Product with ID ${item.productId} not found.`, 404);
                }
                totalAmount += product.basePrice * item.quantity;
                productDetails.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.basePrice,
                });
            }
            const orderData = {
                user: userId,
                products: productDetails,
                totalAmount,
                orderStatus: 'Pending',
            };
            console.log('Order Data:', orderData);
            const order = await this.orderRepository.createOrder(orderData);
            console.log('Created Order:', order);
            return order;
        }
        catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
    async getOrderById(id) {
        const order = await this.orderRepository.findOrderById(id);
        if (!order) {
            throw new AppError_1.default(`Order with ID ${id} not found.`, 404);
        }
        return order;
    }
    async updateOrderStatus(id, status) {
        const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            throw new AppError_1.default(`Invalid order status: ${status}`, 400);
        }
        const updatedOrder = await this.orderRepository.updateOrderStatus(id, status);
        if (!updatedOrder) {
            throw new AppError_1.default(`Order with ID ${id} not found.`, 404);
        }
        return updatedOrder;
    }
    async deleteOrder(id) {
        const deletedOrder = await this.orderRepository.deleteOrder(id);
        if (!deletedOrder) {
            throw new AppError_1.default(`Order with ID ${id} not found.`, 404);
        }
        return deletedOrder;
    }
}
exports.default = OrderService;
