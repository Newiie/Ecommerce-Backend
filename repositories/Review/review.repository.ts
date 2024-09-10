export interface IReviewRepository {
  createReview(reviewData: any): Promise<any>;
  findReviewById(id: string): Promise<any>;
  updateReview(id: string, reviewData: any): Promise<any>;
  deleteReview(id: string): Promise<any>;
  getAllReviews(): Promise<any>;
}
