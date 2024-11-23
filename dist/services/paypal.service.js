"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const get_access_token = middleware_1.default.get_access_token;
const endpoint_url = 'https://api.sandbox.paypal.com';
class PaypalService {
    orderRepository;
    productRepository;
    userRepository;
    constructor(orderRepository, productRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    async createOrder(userId, currency) {
        try {
            const accessToken = await get_access_token();
            const user = await user_model_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const cartData = await this.userRepository.getCart(userId);
            if (!cartData) {
                throw new AppError_1.default("CartData not found", 404);
            }
            // console.log("USER CART: ", user.cart);
            let totalAmount = 0;
            for (const item of cartData) {
                totalAmount += item.basePrice * item.quantity;
            }
            //   const product = item.product as any; 
            //   let finalPrice = product.basePrice; 
            //   // const variation = product.variations.find(
            //   //   (variation: IProductVariation) => variation.variationId.toString() === item.variationId?.toString()
            //   // );
            //   // if (variation) {
            //   //   finalPrice = variation.price;
            //   //   if (variation.discountRate) {
            //   //     finalPrice = finalPrice * (1 - variation.discountRate / 100);
            //   //   }
            //   // } else 
            //   if (product.discountRate) {
            //     // If no specific variation and product-level discount exists, apply it
            //     finalPrice = finalPrice * (1 - product.discountRate / 100);
            //   }
            //   // Calculate item total and add to the running total amount
            //   return acc + finalPrice * item.quantity;
            // }, 0);
            // console.log("TOTAL AMOUNT: ", totalAmount);
            // Prepare order data for PayPal with securely calculated total amount
            const order_data_json = {
                intent: 'CAPTURE',
                purchase_units: [{
                        amount: {
                            currency_code: currency,
                            // value: "1.00",
                            value: totalAmount.toFixed(2) // Format total for PayPal
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
            const approvalUrl = json.links.find((link) => link.rel === 'approve').href;
            console.log("APPROVAL URL: ", approvalUrl, "\nORDER ID: ", json.id);
            // // Clear the user's cart on successful order creation
            // user.cart = [];
            // await user.save();
            return { approvalUrl, orderId: json.id };
        }
        catch (err) {
            console.error('Error creating PayPal order:', err);
            throw new Error('Failed to create PayPal order');
        }
    }
    async captureOrder(orderID, userId) {
        try {
            const accessToken = await get_access_token();
            const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const json = await response.json(); // Store the JSON response here
            console.log("RESPONSE CAPTURE ORDER: ", json);
            if (!response.ok) {
                console.error('Error from PayPal:', json);
                throw new Error(`PayPal order capture failed: ${json.message}`);
            }
            console.log("USER ID: ", userId);
            console.log("ORDER ID: ", orderID);
            const user = await user_model_1.default.findById(userId).populate('cart');
            if (!user) {
                throw new AppError_1.default('User not found', 404);
            }
            const cartData = await this.userRepository.getCart(userId);
            if (!cartData) {
                throw new AppError_1.default("CartData not found", 404);
            }
            let totalAmount = 0;
            for (const item of cartData) {
                totalAmount += item.basePrice * item.quantity;
            }
            // console.log("user: ", user);   
            // console.log("CART DATA: ", cartData);
            const orderData = {
                user: user._id,
                products: cartData.map((item) => ({
                    product: item._id.toString(),
                    quantity: item.quantity
                })),
                orderId: orderID,
                totalAmount: totalAmount,
                orderStatus: "Pending"
            };
            // console.log("ORDER DATA: ", orderData);
            const order = await this.orderRepository.createOrder(orderData);
            // console.log("ORDER: ", order);  
            user.cart = [];
            user.orders.push(order._id);
            await order.save();
            await user.save();
            return { statusCode: response.status };
        }
        catch (err) {
            console.error('Error capturing PayPal order:', err);
            throw new Error('Failed to capture PayPal order');
        }
    }
}
exports.default = PaypalService;
