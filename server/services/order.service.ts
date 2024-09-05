import {IOrderRepository} from '../repositories/Order/order.repository'
import AppError from '../utils/AppError';

class OrderService {
  private orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  // Create a new order
  public async createOrder(userId: string, products: any[], totalAmount: number) {
    // Construct the order data
    const orderData = {
      user: userId,
      products,
      totalAmount,
      orderStatus: 'Pending',
    };

    // Save the order to the database
    const order = await this.orderRepository.createOrder(orderData);

    return order;
  }

  // Find an order by its ID
  public async getOrderById(id: string) {
    const order = await this.orderRepository.findOrderById(id);

    if (!order) {
      throw new AppError(`Order with ID ${id} not found.`, 404);
    }

    return order;
  }

  // Update the order status
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

  // Delete an order
  public async deleteOrder(id: string) {
    const deletedOrder = await this.orderRepository.deleteOrder(id);

    if (!deletedOrder) {
      throw new AppError(`Order with ID ${id} not found.`, 404);
    }

    return deletedOrder;
  }
}

export default OrderService;
