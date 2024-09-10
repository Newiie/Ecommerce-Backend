import { Request, Response, NextFunction } from 'express';
import ReviewService from '../services/review.service';
import { MongoDbReviewRepository } from '../repositories/Review/mongodb.review.repository';
import logger from '../utils/logger';

class ReviewController {
  private reviewService : ReviewService;

  constructor() {
    this.reviewService = new ReviewService(new MongoDbReviewRepository)
  }

  public  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Creating review with data:', req.body);
      const review = await this.reviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      logger.error('Error creating review:', error); 
      next(error);
    }
  }

  public  getReviewById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  }

  public  updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.updateReview(req.params.id, req.body);
      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  }

  public  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.deleteReview(req.params.id);
      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  }

  public  getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await this.reviewService.getAllReviews();
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
