import { IReviewRepository } from '../repositories/Review/review.repository';
import AppError from '../utils/AppError';
import { IReview } from '../utils/types';
import logger from '../utils/logger';

class ReviewService {
  private reviewRepository: IReviewRepository;

  constructor(reviewRepository: IReviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  public async createReview(reviewData: IReview) {
    try {
      logger.info('Creating review with data:', reviewData); 
      return await this.reviewRepository.createReview(reviewData);
    } catch (error) {
      logger.error('Error creating review:', error); 
      throw new AppError('Failed to create review.', 500);
    }
  }

  public async getReviewById(id: string) {
    const review = await this.reviewRepository.findReviewById(id);
    if (!review) {
      throw new AppError(`Review with ID ${id} not found.`, 404);
    }
    return review;
  }

  public async updateReview(id: string, reviewData: Partial<IReview>) {
    const updatedReview = await this.reviewRepository.updateReview(id, reviewData);
    if (!updatedReview) {
      throw new AppError(`Review with ID ${id} not found.`, 404);
    }
    return updatedReview;
  }

  public async deleteReview(id: string) {
    const deletedReview = await this.reviewRepository.deleteReview(id);
    if (!deletedReview) {
      throw new AppError(`Review with ID ${id} not found.`, 404);
    }
    return deletedReview;
  }

  public async getAllReviews() {
    return await this.reviewRepository.getAllReviews();
  }
}

export default ReviewService;
