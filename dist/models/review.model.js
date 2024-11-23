"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    image: { type: String },
    location: { type: String, required: true },
    reviewedAt: { type: Date, default: Date.now },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
});
reviewSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.reviewId = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
