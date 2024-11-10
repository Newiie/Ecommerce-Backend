import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import mongoDbUserRepository from '../repositories/User/mongodb.user.repository';
import { IUserRepository } from '../repositories/User/user.repository.interface';
import { IOrderRepository } from '../repositories/Order/order.repository';
import { IProductRepository } from '../repositories/Product/product.repository';
import middleware from '../utils/middleware';
import { IProductVariation } from '../utils/types';

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
  
      const user = await User.findById(userId).populate('cart.product');
      if (!user) {
        throw new Error('User not found');
      }

      console.log("USER CART: ", user.cart);
  
     
      const totalAmount = user.cart.reduce((acc, item : any) => {
        const product = item.product as any; 
        let finalPrice = product.basePrice; 

        // const variation = product.variations.find(
        //   (variation: IProductVariation) => variation.variationId.toString() === item.variationId?.toString()
        // );
  
        // if (variation) {
        
        //   finalPrice = variation.price;
        //   if (variation.discountRate) {
        //     finalPrice = finalPrice * (1 - variation.discountRate / 100);
        //   }
        // } else 
        if (product.discountRate) {
          // If no specific variation and product-level discount exists, apply it
          finalPrice = finalPrice * (1 - product.discountRate / 100);
        }
  
        // Calculate item total and add to the running total amount
        return acc + finalPrice * item.quantity;
      }, 0);
  
      console.log("TOTAL AMOUNT: ", totalAmount);
  
      // Prepare order data for PayPal with securely calculated total amount
      const order_data_json = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            // value: "1.00",
            value: totalAmount.toFixed(2)  // Format total for PayPal
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
  
      // // Clear the user's cart on successful order creation
      // user.cart = [];
      // await user.save();
  
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


        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error from PayPal:', errorResponse);
            throw new Error(`PayPal order capture failed: ${errorResponse.message}`);
        }

        const user = await User.findById(userId).populate('cart.product');

        if (!user) {
            throw new Error('User not found');
        }

        const totalAmount = user.cart.reduce((acc, item : any) => {
          const product = item.product as any; 
          return acc + product.basePrice * item.quantity;
        }, 0);

        console.log("user: ", user);   

        const orderData = {
          user: user._id,
          products: user.cart,
          orderId: orderID,
          totalAmount: totalAmount,
          orderStatus: "Pending"
        }

        const order = await this.orderRepository.createOrder(orderData);

        user.cart = [];
        user.orders.push(order._id);
        await order.save();
        await user.save();

        const json = await response.json();
        return {status: json.status, statusCode: response.status}; 

    } catch (err) {
        console.error('Error capturing PayPal order:', err);
        throw new Error('Failed to capture PayPal order');
    }
}

}

export default PaypalService;
