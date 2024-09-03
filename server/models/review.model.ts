import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  rating: number;
  comment: string;
  image?: string;
  location: string;
  reviewedAt: Date;
  user: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  image: { type: String },
  location: { type: String, required: true },
  reviewedAt: { type: Date, required: true, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
