import mongoose, { Schema, Document } from "mongoose";
import { IReview } from "../utils/types";

const reviewSchema = new mongoose.Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  image: { type: String },
  location: { type: String, required: true },
  reviewedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
});

reviewSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.reviewId = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
