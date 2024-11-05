import mongoose, { Schema, Document } from "mongoose";
import { IUser }  from "../utils/types";

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  orderHistory: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      purchasedAt: { type: Date, default: Date.now }
    }
  ], 
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
