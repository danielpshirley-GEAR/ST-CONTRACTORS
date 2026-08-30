/**
 * GOOGLE BUSINESS PROFILE (GBP) TYPES
 */

export interface GoogleBusinessReview {
  reviewId: string;
  reviewerName: string;
  starRating: number;
  comment?: string;
  createTime: string;
  replyComment?: string;
}

export interface GoogleBusinessLocationProfile {
  locationId: string;
  businessName: string;
  primaryCategory: string;
  addressLines: string[];
  phoneNumber: string;
  websiteUrl: string;
  averageRating: number;
  totalReviewCount: number;
  isVerified: boolean;
}
