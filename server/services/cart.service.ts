// import User from "../models/user.model";
// import Product from "../models/product.model";
// import Order from "../models/order.model";

// class CartService {
//   async addToCart(userId: string, productId: string, quantity: number) {
//     const user = await User.findById(userId);
//     const product = await Product.findById(productId);
//     if (!product) throw new Error('Product not found');

//     const cartItem = user.cart.find(item => item.product.toString() === productId);
//     if (cartItem) {
//       cartItem.quantity += quantity;
//     } else {
//       user.cart.push({ product: productId, quantity });
//     }
//     await user.save();
//     return user;
//   }

//   async removeFromCart(userId: string, productId: string) {
//     const user = await User.findById(userId);
//     user.cart = user.cart.filter(item => item.product.toString() !== productId);
//     await user.save();
//     return user;
//   }

//   async updateCart(userId: string, productId: string, quantity: number) {
//     const user = await User.findById(userId);
//     const cartItem = user.cart.find(item => item.product.toString() === productId);
//     if (cartItem) {
//       cartItem.quantity = quantity;
//       await user.save();
//     }
//     return user;
//   }
// }

// export default new CartService();
