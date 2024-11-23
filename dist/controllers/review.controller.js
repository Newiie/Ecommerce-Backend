"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_service_1 = __importDefault(require("../services/review.service"));
const mongodb_review_repository_1 = require("../repositories/Review/mongodb.review.repository");
const logger_1 = __importDefault(require("../utils/logger"));
class ReviewController {
    reviewService;
    constructor() {
        this.reviewService = new review_service_1.default(new mongodb_review_repository_1.MongoDbReviewRepository);
    }
    createReview = async (req, res, next) => {
        try {
            const review = await this.reviewService.createReview(req.body);
            res.status(201).json(review);
        }
        catch (error) {
            logger_1.default.error('Error creating review:', error);
            next(error);
        }
    };
    getReviewById = async (req, res, next) => {
        try {
            const review = await this.reviewService.getReviewById(req.params.id);
            res.status(200).json(review);
        }
        catch (error) {
            next(error);
        }
    };
    updateReview = async (req, res, next) => {
        try {
            const review = await this.reviewService.updateReview(req.params.id, req.body);
            res.status(200).json(review);
        }
        catch (error) {
            next(error);
        }
    };
    deleteReview = async (req, res, next) => {
        try {
            const review = await this.reviewService.deleteReview(req.params.id);
            res.status(200).json(review);
        }
        catch (error) {
            next(error);
        }
    };
    getAllReviews = async (req, res, next) => {
        try {
            const reviews = await this.reviewService.getAllReviews();
            res.status(200).json(reviews);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new ReviewController();
