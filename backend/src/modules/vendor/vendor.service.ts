import { Injectable } from '@nestjs/common';

@Injectable()
export class VendorService {
  async getReviewsStats() {
    return {
      success: true,
      data: {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        recentReviews: [],
      },
    };
  }
}

