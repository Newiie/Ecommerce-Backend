import Review from '../../models/review.model';
import { IReview} from '../../utils/types';
import { IReviewRepository } from './review.repository';

class MongoDbReviewRepository implements IReviewRepository {
  public async createReview(reviewData: IReview): Promise<IReview> {
    try {
      console.log('Saving review to database:', reviewData); 
      const review = new Review(reviewData);
      return await review.save();
    } catch (error) {
      console.error('Error saving review to database:', error); 
      throw error;
    }
  }

  public async findReviewById(id: string): Promise<IReview | null> {
    return await Review.findById(id).populate('user').populate('product');
  }

  public async updateReview(id: string, reviewData: Partial<IReview>): Promise<IReview | null> {
    return await Review.findByIdAndUpdate(id, reviewData, { new: true });
  }

  public async deleteReview(id: string): Promise<IReview | null> {
    return await Review.findByIdAndDelete(id);
  }

  public async getAllReviews(): Promise<IReview[]> {
    return await Review.find({});
  }
}

export { MongoDbReviewRepository };
