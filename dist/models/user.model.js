"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    cart: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    orderHistory: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            purchasedAt: { type: Date, default: Date.now }
        }
    ],
    orders: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Order' }],
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
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
