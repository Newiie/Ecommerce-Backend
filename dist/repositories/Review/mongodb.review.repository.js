"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbReviewRepository = void 0;
const review_model_1 = __importDefault(require("../../models/review.model"));
class MongoDbReviewRepository {
    async createReview(reviewData) {
        try {
            console.log('Saving review to database:', reviewData);
            const review = new review_model_1.default(reviewData);
            return await review.save();
        }
        catch (error) {
            console.error('Error saving review to database:', error);
            throw error;
        }
    }
    async findReviewById(id) {
        return await review_model_1.default.findById(id).populate('user').populate('product');
    }
    async updateReview(id, reviewData) {
        return await review_model_1.default.findByIdAndUpdate(id, reviewData, { new: true });
    }
    async deleteReview(id) {
        return await review_model_1.default.findByIdAndDelete(id);
    }
    async getAllReviews() {
        return await review_model_1.default.find({});
    }
}
exports.MongoDbReviewRepository = MongoDbReviewRepository;
