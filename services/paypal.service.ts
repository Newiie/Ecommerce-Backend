import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import mongoDbUserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
import { IOrderRepository } from '../repositories/Order/order.repository';
import { IProductRepository } from '../repositories/Product/product.repository';
import middleware from '../utils/middleware';

const get_access_token = middleware.get_access_token;
const endpoint_url = 'https://api-m.sandbox.paypal.com';
class PaypalService {
  private orderRepository: IOrderRepository;
  private productRepository: IProductRepository;
  constructor(orderRepository: IOrderRepository, productRepository: IProductRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  public async createOrder(orderID: string) {
    try {
      const accessToken = await get_access_token();
      const order_data_json = {
        'intent': 'CAPTURE',
        'purchase_units': [{
          'amount': {
            'currency_code': 'USD',
            'value': '100.00'
          }
        }]
      };
      const data = JSON.stringify(order_data_json);

      const response = await fetch(endpoint_url + '/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: data
      });

      const json = await response.json();
      return json; // Return the JSON response
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create order');
    }
  }
}

export default PaypalService;
