import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import mongoDbUserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
import { IOrderRepository } from '../repositories/Order/order.repository';
import { IProductRepository } from '../repositories/Product/product.repository';
import middleware from '../utils/middleware';
import { IProductVariation } from '../utils/types';
import AppError from '../utils/AppError';

const get_access_token = middleware.get_access_token;

const endpoint_url = 'https://api.sandbox.paypal.com';

class PaypalService {
  private orderRepository: IOrderRepository;
  private productRepository: IProductRepository;
  private userRepository: IUserRepository;

  constructor(orderRepository: IOrderRepository, productRepository: IProductRepository, userRepository: IUserRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  public async createOrder(userId: string, currency: string) {
    try {
      const accessToken = await get_access_token();
  
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const cartData = await this.userRepository.getCart(userId);
      if (!cartData) {
          throw new AppError("CartData not found", 404);
      }
      // console.log("USER CART: ", user.cart);
      
      let totalAmount = 0;
      for (const item of cartData) {
        totalAmount += item.basePrice * item.quantity;
      }

      // Prepare order data for PayPal with securely calculated total amount
      const order_data_json = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: totalAmount.toFixed(2)  
          }
        }]
      };
  
      // Send order creation request to PayPal
      const response = await fetch('https://api.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(order_data_json)
      });
      

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error from PayPal:', errorResponse);
        throw new Error(`PayPal order creation failed: ${errorResponse.message}`);
      }
  
      const json = await response.json();
      console.log('PayPal order created:', json);
  
      const approvalUrl = json.links.find((link: any) => link.rel === 'approve').href;
      console.log("APPROVAL URL: ", approvalUrl, "\nORDER ID: ", json.id);
  
      return { approvalUrl, orderId: json.id };
  
    } catch (err) {
      console.error('Error creating PayPal order:', err);
      throw new Error('Failed to create PayPal order');
    }
  }
  
  
  public async captureOrder(orderID: string, userId: string) {
    try {
        const accessToken = await get_access_token();
   
        const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const json = await response.json();  
        console.log("RESPONSE CAPTURE ORDER: ", json);

        if (!response.ok) {
            console.error('Error from PayPal:', json);
            throw new Error(`PayPal order capture failed: ${json.message}`);
        }

        console.log("USER ID: ", userId);
        console.log("ORDER ID: ", orderID);

        const user = await User.findById(userId).populate('cart');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const cartData = await this.userRepository.getCart(userId);

        if (!cartData) {
            throw new AppError("CartData not found", 404);
        }

        let totalAmount = 0;

        for (const item of cartData) {
          totalAmount += item.basePrice * item.quantity;
        }

        const orderData = {
          user: user._id,
          products: cartData.map((item: any) => ({
            product: item._id.toString(),
            quantity: item.quantity
          })),
          orderId: orderID,
          totalAmount: totalAmount,
          orderStatus: "Pending"
        }

        const order = await this.orderRepository.createOrder(orderData);

        user.cart = [];
        user.orders.push(order._id);
        
        await order.save();
        await user.save();

        return {statusCode: response.status}; 

    } catch (err) {
        console.error('Error capturing PayPal order:', err);
        throw new Error('Failed to capture PayPal order');
    }
}

}

export default PaypalService;
