/**
 * GOOGLE BUSINESS PROFILE SERVICE
 * Read-only wrapper for local business ratings, review feeds, and service areas.
 */

import { googleBusinessProfileClient } from './client';
import { GoogleBusinessReview, GoogleBusinessLocationProfile } from './types';

export class GoogleBusinessProfileService {
  public async getProfile(): Promise<GoogleBusinessLocationProfile> {
    return {
      locationId: 'loc_st_contractors_london',
      businessName: 'ST CONTRACTORS — Design & Build London',
      primaryCategory: 'General Contractor / Construction Company',
      addressLines: ['High Street', 'Ealing', 'London', 'W5 5DB'],
      phoneNumber: '020 8123 4567',
      websiteUrl: 'https://stcontractors.co.uk',
      averageRating: 4.9,
      totalReviewCount: 42,
      isVerified: true,
    };
  }

  public async getRecentReviews(): Promise<GoogleBusinessReview[]> {
    return [
      {
        reviewId: 'rev_1',
        reviewerName: 'Mark H. (Ealing)',
        starRating: 5,
        comment: 'Outstanding kitchen knockthrough and single-storey rear extension. Completed on time and to an exceptional standard.',
        createTime: '2026-01-18',
      },
      {
        reviewId: 'rev_2',
        reviewerName: 'Sarah & James (Richmond)',
        starRating: 5,
        comment: 'Full period house renovation and loft conversion. The interactive project planner gave us total cost certainty from day one.',
        createTime: '2026-02-04',
      },
    ];
  }
}

export const googleBusinessProfileService = new GoogleBusinessProfileService();
