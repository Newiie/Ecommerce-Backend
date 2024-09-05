import mongoose, { Schema, Document } from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, required: true, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    orderedAt: { type: Date, default: Date.now },
  });
  
  const Order = mongoose.model('Order', orderSchema);
  export default Order;
  