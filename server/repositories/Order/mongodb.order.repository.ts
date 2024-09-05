
import Order from '../../models/order.model';
import { IOrderRepository } from './order.repository';


class MongoDbOrderRepository implements IOrderRepository {
  async createOrder(orderData: any): Promise<any> {
    const order = new Order(orderData);
    return await order.save();
  }

  async findOrderById(id: string): Promise<any> {
    return await Order.findById(id).populate('products.product').populate('user');
  }

  async updateOrderStatus(id: string, status: string): Promise<any> {
    return await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
  }

  async deleteOrder(id: string): Promise<any> {
    return await Order.findByIdAndDelete(id);
  }
}

export { MongoDbOrderRepository };
