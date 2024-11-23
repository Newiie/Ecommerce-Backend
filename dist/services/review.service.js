"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const logger_1 = __importDefault(require("../utils/logger"));
class ReviewService {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async createReview(reviewData) {
        try {
            logger_1.default.info('Creating review with data:', reviewData);
            return await this.reviewRepository.createReview(reviewData);
        }
        catch (error) {
            logger_1.default.error('Error creating review:', error);
            throw new AppError_1.default('Failed to create review.', 500);
        }
    }
    async getReviewById(id) {
        const review = await this.reviewRepository.findReviewById(id);
        if (!review) {
            throw new AppError_1.default(`Review with ID ${id} not found.`, 404);
        }
        return review;
    }
    async updateReview(id, reviewData) {
        const updatedReview = await this.reviewRepository.updateReview(id, reviewData);
        if (!updatedReview) {
            throw new AppError_1.default(`Review with ID ${id} not found.`, 404);
        }
        return updatedReview;
    }
    async deleteReview(id) {
        const deletedReview = await this.reviewRepository.deleteReview(id);
        if (!deletedReview) {
            throw new AppError_1.default(`Review with ID ${id} not found.`, 404);
        }
        return deletedReview;
    }
    async getAllReviews() {
        return await this.reviewRepository.getAllReviews();
    }
}
exports.default = ReviewService;
