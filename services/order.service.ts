import { IOrderRepository } from '../repositories/Order/order.repository';
import { IProductRepository } from '../repositories/Product/product.repository';
import AppError from '../utils/AppError';

class OrderService {
  private orderRepository: IOrderRepository;
  private productRepository: IProductRepository;

  constructor(orderRepository: IOrderRepository, productRepository: IProductRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  public async createOrder(userId: string, products: { productId: string, quantity: number }[]) {
    let totalAmount = 0;

    try {
      const productDetails = [];

      for (const item of products) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new AppError(`Product with ID ${item.productId} not found.`, 404);
        }
        totalAmount += product.basePrice * item.quantity; // Use basePrice instead of price
        productDetails.push({
          product: product._id,
          quantity: item.quantity,
          price: product.basePrice, // Use basePrice instead of price
        });
      }

      const orderData = {
        user: userId,
        products: productDetails,
        totalAmount,
        orderStatus: 'Pending',
      };

      console.log('Order Data:', orderData); // Log the order data

      const order = await this.orderRepository.createOrder(orderData);
      console.log('Created Order:', order); // Log the created order
      return order;
    } catch (error) {
      console.error('Error creating order:', error); // Log the error
      throw error;
    }
  }

  public async getOrderById(id: string) {
    const order = await this.orderRepository.findOrderById(id);

    if (!order) {
      throw new AppError(`Order with ID ${id} not found.`, 404);
    }

    return order;
  }

  public async updateOrderStatus(id: string, status: string) {
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid order status: ${status}`, 400);
    }

    const updatedOrder = await this.orderRepository.updateOrderStatus(id, status);

    if (!updatedOrder) {
      throw new AppError(`Order with ID ${id} not found.`, 404);
    }

    return updatedOrder;
  }

  public async deleteOrder(id: string) {
    const deletedOrder = await this.orderRepository.deleteOrder(id);

    if (!deletedOrder) {
      throw new AppError(`Order with ID ${id} not found.`, 404);
    }

    return deletedOrder;
  }
}

export default OrderService;

