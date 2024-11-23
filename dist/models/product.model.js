"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productVariationSchema = new mongoose_1.default.Schema({
    variationName: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    basePrice: { type: Number, required: true },
    discountRate: { type: Number },
    productImage: { type: Buffer },
    stock: { type: Number, required: true, default: 0 },
});
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numOfReviews: { type: Number, required: true, default: 0 },
    productImage: { type: Buffer, required: true },
    variations: [productVariationSchema],
    defaultVariationIndex: { type: Number, default: 0 },
    basePrice: { type: Number, required: true, default: 0 },
});
productSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.productId = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
productVariationSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.variationId = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
