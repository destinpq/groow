/**
 * Service Auctions API for B2B Marketplace
 * 
 * Handles reverse auctions, vendor bidding, and service procurement
 * auctions for business services marketplace
 */

import api from './client';

// Backend Entity Integration (Type-only imports for frontend compatibility)
interface ServiceAuctionEntityBase {
  id: string;
  auctionNumber: string;
  serviceId: string;
  vendorId: string;
  title: string;
  description: string;
  auctionType: 'reverse' | 'forward' | 'sealed_bid' | 'dutch';
  startingPrice: number;
  reservePrice: number;
  buyNowPrice: number;
  currentBid: number;
  minBidIncrement: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'scheduled' | 'active' | 'extended' | 'ended' | 'cancelled' | 'awarded';
  totalBids: number;
  totalBidders: number;
  watchers: number;
  winnerId: string;
  winningBid: number;
  serviceRequirements: {
    scope: string;
    deliverables: string[];
    timeline: string;
    skillsRequired: string[];
    experienceLevel: 'entry' | 'intermediate' | 'expert';
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    location?: string;
    remote?: boolean;
    languages?: string[];
  };
  evaluationCriteria: {
    price: number;
    quality: number;
    timeline: number;
    experience: number;
    reviews: number;
  };
  terms: {
    paymentTerms?: string;
    cancellationPolicy?: string;
    revisionRounds?: number;
    warrantyCoverage?: string;
    supportIncluded?: boolean;
  };
  attachments: string[];
  allowAutoBidding: boolean;
  isPrivate: boolean;
  invitedVendors: string[];
  requiresApproval: boolean;
  maxParticipants: number;
  hasAutoExtension: boolean;
  autoExtensionMinutes: number;
  viewCount: number;
  awardedAt: Date;
  awardedBy: string;
  cancellationReason: string;
  notes: string;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuctionBidEntityBase {
  id: string;
  auctionId: string;
  bidderId: string;
  bidAmount: number;
  maxBidAmount: number;
  bidType: 'manual' | 'automatic' | 'proxy';
  isWinning: boolean;
  isActive: boolean;
  proposal: string;
  deliveryTimeline: {
    estimatedDays: number;
    milestones: Array<{
      title: string;
      description: string;
      deliveryDays: number;
      payment: number;
    }>;
  };
  qualifications: {
    experience: string;
    portfolioItems: string[];
    certifications: string[];
    teamSize: number;
    availability: string;
  };
  attachments: string[];
  ipAddress: string;
  userAgent: string;
  retractedAt: Date;
  retractionReason: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface AuctionWatcherEntityBase {
  id: string;
  auctionId: string;
  userId: string;
  notifyOnBid: boolean;
  notifyOnEnd: boolean;
  notifyOnExtension: boolean;
  lastNotifiedAt: Date;
  createdAt: Date;
}

interface AuctionActivityEntityBase {
  id: string;
  auctionId: string;
  userId: string;
  activityType: 'bid_placed' | 'bid_retracted' | 'auction_started' | 'auction_extended' | 'auction_ended' | 'question_asked' | 'question_answered' | 'auction_awarded' | 'buy_now';
  description: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  createdAt: Date;
}

interface AuctionQuestionEntityBase {
  id: string;
  auctionId: string;
  askerId: string;
  question: string;
  answer: string;
  answeredBy: string;
  answeredAt: Date;
  isAnswered: boolean;
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BidEvaluationEntityBase {
  id: string;
  bidId: string;
  auctionId: string;
  evaluatorId: string;
  priceScore: number;
  qualityScore: number;
  timelineScore: number;
  experienceScore: number;
  totalScore: number;
  comments: string;
  criteriaScores: Record<string, number>;
  isRecommended: boolean;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Standardized Response Types
export interface AuctionAPIResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: Date;
  errors?: string[];
  metadata?: Record<string, any>;
}

export interface PaginatedAuctionResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
  };
  message: string;
  timestamp: Date;
}
// Enhanced B2B Service Auction Types
export interface ServiceAuction extends Omit<ServiceAuctionEntityBase, 'service' | 'vendor' | 'winner' | 'bids' | 'watchersList' | 'activities' | 'questions' | 'orders'> {
  serviceName?: string;
  serviceCategory?: string;
  vendorInfo?: {
    id: string;
    companyName: string;
    rating: number;
    isVerified: boolean;
    logo?: string;
  };
  serviceInfo?: {
    id: string;
    title: string;
    category: string;
    description: string;
    icon?: string;
  };
  winnerInfo?: {
    id: string;
    name: string;
    companyName: string;
    rating: number;
    avatar?: string;
  };
  auctionMetrics?: {
    timeRemaining: string;
    daysActive: number;
    averageBid: number;
    participationRate: number;
    savingsPercentage: number;
  };
  currentUserBid?: {
    amount: number;
    rank: number;
    isWinning: boolean;
  };
  recommendations?: {
    suggestedBid: number;
    marketPrice: number;
    confidence: number;
  };
}

export interface AuctionBid extends Omit<AuctionBidEntityBase, 'auction' | 'bidder' | 'evaluations'> {
  bidderInfo?: {
    id: string;
    name: string;
    companyName: string;
    rating: number;
    avatar?: string;
    isVerified: boolean;
    responseTime: string;
    completionRate: number;
  };
  auctionInfo?: {
    id: string;
    title: string;
    auctionNumber: string;
    status: string;
  };
  bidRank?: number;
  competitiveAnalysis?: {
    isLowestBid: boolean;
    distanceFromWinning: number;
    marketPosition: 'competitive' | 'high' | 'average';
  };
  evaluationSummary?: {
    averageScore: number;
    recommendationCount: number;
    evaluatorCount: number;
  };
}

export interface AuctionWatcher extends AuctionWatcherEntityBase {
  userInfo?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface AuctionActivity extends Omit<AuctionActivityEntityBase, 'auction' | 'user'> {
  userInfo?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  formattedDescription?: string;
}

export interface AuctionQuestion extends Omit<AuctionQuestionEntityBase, 'auction' | 'asker' | 'answerer'> {
  askerInfo?: {
    id: string;
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  answererInfo?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface BidEvaluation extends Omit<BidEvaluationEntityBase, 'bid' | 'auction' | 'evaluator'> {
  bidInfo?: {
    id: string;
    bidAmount: number;
    bidderName: string;
  };
  evaluatorInfo?: {
    id: string;
    name: string;
    role: string;
  };
  scoringBreakdown?: {
    price: { score: number; weight: number; weightedScore: number };
    quality: { score: number; weight: number; weightedScore: number };
    timeline: { score: number; weight: number; weightedScore: number };
    experience: { score: number; weight: number; weightedScore: number };
  };
}

// Request/Response DTOs
export interface CreateServiceAuctionData {
  serviceId: string;
  title: string;
  description: string;
  auctionType: 'reverse' | 'forward' | 'sealed_bid' | 'dutch';
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  minBidIncrement?: number;
  startDate: string;
  endDate: string;
  serviceRequirements: {
    scope: string;
    deliverables: string[];
    timeline: string;
    skillsRequired: string[];
    experienceLevel: 'entry' | 'intermediate' | 'expert';
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    location?: string;
    remote?: boolean;
    languages?: string[];
  };
  evaluationCriteria?: {
    price: number;
    quality: number;
    timeline: number;
    experience: number;
    reviews: number;
  };
  terms?: {
    paymentTerms?: string;
    cancellationPolicy?: string;
    revisionRounds?: number;
    warrantyCoverage?: string;
    supportIncluded?: boolean;
  };
  attachments?: string[];
  isPrivate?: boolean;
  invitedVendors?: string[];
  requiresApproval?: boolean;
  maxParticipants?: number;
  hasAutoExtension?: boolean;
  autoExtensionMinutes?: number;
}

export interface CreateAuctionBidData {
  auctionId: string;
  bidAmount: number;
  maxBidAmount?: number; // For automatic bidding
  bidType?: 'manual' | 'automatic' | 'proxy';
  proposal: string;
  deliveryTimeline: {
    estimatedDays: number;
    milestones: Array<{
      title: string;
      description: string;
      deliveryDays: number;
      payment: number;
    }>;
  };
  qualifications: {
    experience: string;
    portfolioItems: string[];
    certifications: string[];
    teamSize: number;
    availability: string;
  };
  attachments?: string[];
}

export interface UpdateAuctionBidData extends Partial<Omit<CreateAuctionBidData, 'auctionId'>> {}

export interface CreateAuctionQuestionData {
  auctionId: string;
  question: string;
  isPublic?: boolean;
}

export interface CreateBidEvaluationData {
  bidId: string;
  priceScore: number;
  qualityScore: number;
  timelineScore: number;
  experienceScore: number;
  comments?: string;
  criteriaScores?: Record<string, number>;
  isRecommended?: boolean;
}

export interface AuctionFilters {
  status?: string[];
  auctionType?: string[];
  serviceCategory?: string[];
  vendorId?: string[];
  priceMin?: number;
  priceMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  experienceLevel?: string[];
  location?: string[];
  remote?: boolean;
  hasReservePrice?: boolean;
  hasBuyNow?: boolean;
  minBidders?: number;
  isPrivate?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BidFilters {
  auctionId?: string;
  bidderId?: string;
  bidType?: string[];
  isWinning?: boolean;
  isActive?: boolean;
  amountMin?: number;
  amountMax?: number;
  bidDateFrom?: string;
  bidDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Comprehensive Service Auctions API for B2B Marketplace
export const serviceAuctionsAPI = {
  // Core Auction Management
  auctions: {
    // Get all service auctions with advanced filtering
    getAll: async (filters?: AuctionFilters): Promise<PaginatedAuctionResponse<ServiceAuction>> => {
      const response = await api.get<PaginatedAuctionResponse<ServiceAuction>>('/auctions/services', {
        params: filters,
      });
      return response.data;
    },

    // Get auction by ID with comprehensive details
    getById: async (id: string, includeDetails?: {
      includeBids?: boolean;
      includeActivity?: boolean;
      includeQuestions?: boolean;
      includeAnalytics?: boolean;
    }): Promise<AuctionAPIResponse<ServiceAuction>> => {
      const response = await api.get<AuctionAPIResponse<ServiceAuction>>(`/auctions/services/${id}`, {
        params: includeDetails,
      });
      return response.data;
    },

    // Create new service auction
    create: async (data: CreateServiceAuctionData): Promise<AuctionAPIResponse<ServiceAuction>> => {
      const response = await api.post<AuctionAPIResponse<ServiceAuction>>('/auctions/services', data);
      return response.data;
    },

    // Update auction (before it goes live)
    update: async (id: string, data: Partial<CreateServiceAuctionData>): Promise<AuctionAPIResponse<ServiceAuction>> => {
      const response = await api.put<AuctionAPIResponse<ServiceAuction>>(`/auctions/services/${id}`, data);
      return response.data;
    },

    // Cancel auction
    cancel: async (id: string, data: {
      reason: string;
      notifyParticipants?: boolean;
      refundFees?: boolean;
    }): Promise<AuctionAPIResponse<ServiceAuction>> => {
      const response = await api.post<AuctionAPIResponse<ServiceAuction>>(`/auctions/services/${id}/cancel`, data);
      return response.data;
    },

    // Extend auction duration
    extend: async (id: string, data: {
      additionalMinutes: number;
      reason: string;
      notifyParticipants?: boolean;
    }): Promise<AuctionAPIResponse<ServiceAuction>> => {
      const response = await api.post<AuctionAPIResponse<ServiceAuction>>(`/auctions/services/${id}/extend`, data);
      return response.data;
    },

    // Award auction to winner
    award: async (id: string, data: {
      winnerId: string;
      winningBidId: string;
      notes?: string;
      createOrder?: boolean;
    }): Promise<AuctionAPIResponse<{
      auction: ServiceAuction;
      order?: { id: string; orderNumber: string };
      notifications: { sent: number; failed: number };
    }>> => {
      const response = await api.post<AuctionAPIResponse<any>>(`/auctions/services/${id}/award`, data);
      return response.data;
    },

    // Get auction analytics
    getAnalytics: async (id: string, filters?: {
      includeCompetitiveAnalysis?: boolean;
      includeBidderInsights?: boolean;
      includeMarketComparison?: boolean;
    }): Promise<AuctionAPIResponse<{
      overview: {
        totalViews: number;
        uniqueViewers: number;
        bidderParticipation: number;
        averageBid: number;
        savingsAchieved: number;
        marketPriceComparison: number;
      };
      bidding: {
        bidDistribution: Array<{ range: string; count: number }>;
        biddingPattern: Array<{ time: string; bidCount: number; amount: number }>;
        competitivenessIndex: number;
      };
      participants: {
        topBidders: Array<{
          bidderId: string;
          bidderName: string;
          bidCount: number;
          avgBid: number;
          rating: number;
        }>;
        geographicDistribution: Array<{ region: string; count: number }>;
        experienceLevel: Record<string, number>;
      };
      performance: {
        responseTime: number;
        engagementRate: number;
        conversionRate: number;
        qualityScore: number;
      };
      recommendations: Array<{
        type: 'pricing' | 'timing' | 'requirements' | 'promotion';
        suggestion: string;
        impact: 'high' | 'medium' | 'low';
        rationale: string;
      }>;
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>(`/auctions/services/${id}/analytics`, {
        params: filters,
      });
      return response.data;
    },

    // Get auction recommendations for buyers
    getRecommendations: async (filters?: {
      serviceCategory?: string;
      budget?: number;
      timeline?: string;
      location?: string;
      experienceLevel?: string;
    }): Promise<AuctionAPIResponse<Array<{
      auction: ServiceAuction;
      matchScore: number;
      reasons: string[];
      estimatedSavings: number;
      successProbability: number;
    }>>> => {
      const response = await api.get<AuctionAPIResponse<any>>('/auctions/services/recommendations', {
        params: filters,
      });
      return response.data;
    },
  },

  // Bidding Management
  bids: {
    // Get bids for specific auction
    getByAuction: async (auctionId: string, filters?: BidFilters): Promise<PaginatedAuctionResponse<AuctionBid>> => {
      const response = await api.get<PaginatedAuctionResponse<AuctionBid>>(`/auctions/services/${auctionId}/bids`, {
        params: filters,
      });
      return response.data;
    },

    // Get my bids across all auctions
    getMy: async (filters?: BidFilters): Promise<PaginatedAuctionResponse<AuctionBid>> => {
      const response = await api.get<PaginatedAuctionResponse<AuctionBid>>('/auctions/bids/my-bids', {
        params: filters,
      });
      return response.data;
    },

    // Place new bid
    place: async (data: CreateAuctionBidData): Promise<AuctionAPIResponse<AuctionBid>> => {
      const response = await api.post<AuctionAPIResponse<AuctionBid>>('/auctions/bids', data);
      return response.data;
    },

    // Update existing bid (if allowed)
    update: async (bidId: string, data: UpdateAuctionBidData): Promise<AuctionAPIResponse<AuctionBid>> => {
      const response = await api.put<AuctionAPIResponse<AuctionBid>>(`/auctions/bids/${bidId}`, data);
      return response.data;
    },

    // Retract/withdraw bid
    retract: async (bidId: string, reason: string): Promise<AuctionAPIResponse<AuctionBid>> => {
      const response = await api.post<AuctionAPIResponse<AuctionBid>>(`/auctions/bids/${bidId}/retract`, {
        reason,
      });
      return response.data;
    },

    // Get bid by ID with details
    getById: async (bidId: string): Promise<AuctionAPIResponse<AuctionBid>> => {
      const response = await api.get<AuctionAPIResponse<AuctionBid>>(`/auctions/bids/${bidId}`);
      return response.data;
    },

    // Get competitive analysis for bid
    getCompetitiveAnalysis: async (bidId: string): Promise<AuctionAPIResponse<{
      bidRank: number;
      totalBids: number;
      distanceFromWinning: number;
      marketPosition: 'leading' | 'competitive' | 'behind';
      winningProbability: number;
      suggestions: Array<{
        action: string;
        impact: string;
        urgency: 'high' | 'medium' | 'low';
      }>;
      benchmarks: {
        averageBid: number;
        medianBid: number;
        lowestBid: number;
        highestBid: number;
      };
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>(`/auctions/bids/${bidId}/competitive-analysis`);
      return response.data;
    },

    // Set up automatic bidding
    setupAutoBidding: async (data: {
      auctionId: string;
      maxBidAmount: number;
      incrementAmount: number;
      bidStrategy: 'conservative' | 'aggressive' | 'balanced';
      stopConditions?: {
        timeRemaining?: number; // minutes
        competitorCount?: number;
        priceThreshold?: number;
      };
    }): Promise<AuctionAPIResponse<{
      autoBidId: string;
      status: 'active';
      nextBidAmount: number;
      estimatedWinProbability: number;
    }>> => {
      const response = await api.post<AuctionAPIResponse<any>>('/auctions/bids/auto-bidding', data);
      return response.data;
    },

    // Cancel automatic bidding
    cancelAutoBidding: async (autoBidId: string): Promise<AuctionAPIResponse<{ success: boolean }>> => {
      const response = await api.delete<AuctionAPIResponse<{ success: boolean }>>(`/auctions/bids/auto-bidding/${autoBidId}`);
      return response.data;
    },
  },

  // Evaluation & Scoring
  evaluations: {
    // Get evaluations for a bid
    getByBid: async (bidId: string): Promise<AuctionAPIResponse<BidEvaluation[]>> => {
      const response = await api.get<AuctionAPIResponse<BidEvaluation[]>>(`/auctions/bids/${bidId}/evaluations`);
      return response.data;
    },

    // Submit bid evaluation
    submit: async (data: CreateBidEvaluationData): Promise<AuctionAPIResponse<BidEvaluation>> => {
      const response = await api.post<AuctionAPIResponse<BidEvaluation>>('/auctions/evaluations', data);
      return response.data;
    },

    // Update bid evaluation
    update: async (evaluationId: string, data: Partial<CreateBidEvaluationData>): Promise<AuctionAPIResponse<BidEvaluation>> => {
      const response = await api.put<AuctionAPIResponse<BidEvaluation>>(`/auctions/evaluations/${evaluationId}`, data);
      return response.data;
    },

    // Get evaluation summary for auction
    getSummary: async (auctionId: string): Promise<AuctionAPIResponse<{
      totalEvaluations: number;
      evaluationStatus: 'pending' | 'in_progress' | 'completed';
      averageScores: {
        price: number;
        quality: number;
        timeline: number;
        experience: number;
        overall: number;
      };
      topBids: Array<{
        bidId: string;
        bidderName: string;
        totalScore: number;
        bidAmount: number;
        recommendationCount: number;
      }>;
      evaluationProgress: {
        completed: number;
        pending: number;
        totalRequired: number;
      };
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>(`/auctions/services/${auctionId}/evaluations/summary`);
      return response.data;
    },
  },

  // Questions & Communication
  questions: {
    // Get questions for auction
    getByAuction: async (auctionId: string, filters?: {
      isAnswered?: boolean;
      isPublic?: boolean;
      page?: number;
      limit?: number;
    }): Promise<PaginatedAuctionResponse<AuctionQuestion>> => {
      const response = await api.get<PaginatedAuctionResponse<AuctionQuestion>>(`/auctions/services/${auctionId}/questions`, {
        params: filters,
      });
      return response.data;
    },

    // Ask a question
    ask: async (data: CreateAuctionQuestionData): Promise<AuctionAPIResponse<AuctionQuestion>> => {
      const response = await api.post<AuctionAPIResponse<AuctionQuestion>>('/auctions/questions', data);
      return response.data;
    },

    // Answer a question (auction owner/admin)
    answer: async (questionId: string, answer: string): Promise<AuctionAPIResponse<AuctionQuestion>> => {
      const response = await api.post<AuctionAPIResponse<AuctionQuestion>>(`/auctions/questions/${questionId}/answer`, {
        answer,
      });
      return response.data;
    },

    // Get my questions
    getMy: async (filters?: {
      auctionId?: string;
      isAnswered?: boolean;
      page?: number;
      limit?: number;
    }): Promise<PaginatedAuctionResponse<AuctionQuestion>> => {
      const response = await api.get<PaginatedAuctionResponse<AuctionQuestion>>('/auctions/questions/my-questions', {
        params: filters,
      });
      return response.data;
    },
  },

  // Watch/Follow Management
  watchers: {
    // Watch an auction
    watch: async (auctionId: string, preferences?: {
      notifyOnBid?: boolean;
      notifyOnEnd?: boolean;
      notifyOnExtension?: boolean;
    }): Promise<AuctionAPIResponse<AuctionWatcher>> => {
      const response = await api.post<AuctionAPIResponse<AuctionWatcher>>(`/auctions/services/${auctionId}/watch`, preferences);
      return response.data;
    },

    // Stop watching auction
    unwatch: async (auctionId: string): Promise<AuctionAPIResponse<{ success: boolean }>> => {
      const response = await api.delete<AuctionAPIResponse<{ success: boolean }>>(`/auctions/services/${auctionId}/watch`);
      return response.data;
    },

    // Get my watched auctions
    getMy: async (filters?: {
      status?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedAuctionResponse<ServiceAuction & {
      watchPreferences: {
        notifyOnBid: boolean;
        notifyOnEnd: boolean;
        notifyOnExtension: boolean;
      };
    }>> => {
      const response = await api.get<PaginatedAuctionResponse<any>>('/auctions/watchers/my-watchlist', {
        params: filters,
      });
      return response.data;
    },

    // Update watch preferences
    updatePreferences: async (auctionId: string, preferences: {
      notifyOnBid?: boolean;
      notifyOnEnd?: boolean;
      notifyOnExtension?: boolean;
    }): Promise<AuctionAPIResponse<AuctionWatcher>> => {
      const response = await api.put<AuctionAPIResponse<AuctionWatcher>>(`/auctions/services/${auctionId}/watch`, preferences);
      return response.data;
    },
  },

  // Activity & History
  activities: {
    // Get auction activity feed
    getByAuction: async (auctionId: string, filters?: {
      activityType?: string[];
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedAuctionResponse<AuctionActivity>> => {
      const response = await api.get<PaginatedAuctionResponse<AuctionActivity>>(`/auctions/services/${auctionId}/activities`, {
        params: filters,
      });
      return response.data;
    },

    // Get my auction activities
    getMy: async (filters?: {
      auctionId?: string;
      activityType?: string[];
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedAuctionResponse<AuctionActivity>> => {
      const response = await api.get<PaginatedAuctionResponse<AuctionActivity>>('/auctions/activities/my-activities', {
        params: filters,
      });
      return response.data;
    },

    // Get real-time activity updates
    getRealTime: async (auctionId: string): Promise<AuctionAPIResponse<AuctionActivity[]>> => {
      const response = await api.get<AuctionAPIResponse<AuctionActivity[]>>(`/auctions/services/${auctionId}/activities/real-time`);
      return response.data;
    },
  },

  // Quick Actions
  quickActions: {
    // Buy now (if available)
    buyNow: async (auctionId: string): Promise<AuctionAPIResponse<{
      order: {
        id: string;
        orderNumber: string;
        totalAmount: number;
      };
      auction: ServiceAuction;
      paymentRequired: boolean;
    }>> => {
      const response = await api.post<AuctionAPIResponse<any>>(`/auctions/services/${auctionId}/buy-now`);
      return response.data;
    },

    // Get quick bid suggestions
    getBidSuggestions: async (auctionId: string): Promise<AuctionAPIResponse<{
      suggestions: Array<{
        amount: number;
        type: 'conservative' | 'competitive' | 'aggressive';
        winProbability: number;
        rationale: string;
      }>;
      marketInsights: {
        currentLeadingBid: number;
        averageBid: number;
        recommendedBid: number;
        maxRecommendedBid: number;
      };
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>(`/auctions/services/${auctionId}/bid-suggestions`);
      return response.data;
    },

    // Get auction summary for quick view
    getQuickSummary: async (auctionId: string): Promise<AuctionAPIResponse<{
      basicInfo: {
        title: string;
        status: string;
        timeRemaining: string;
        currentBid: number;
        totalBidders: number;
      };
      myParticipation: {
        isWatching: boolean;
        hasBid: boolean;
        currentBidRank?: number;
        isWinning?: boolean;
      };
      keyMetrics: {
        savingsVsMarket: number;
        competitiveness: 'low' | 'medium' | 'high';
        qualityScore: number;
      };
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>(`/auctions/services/${auctionId}/quick-summary`);
      return response.data;
    },
  },

  // Dashboard & Analytics
  dashboard: {
    // Get auctions dashboard overview
    getOverview: async (): Promise<AuctionAPIResponse<{
      summary: {
        activeAuctions: number;
        myBids: number;
        watchedAuctions: number;
        wonAuctions: number;
        totalSavings: number;
        successRate: number;
      };
      recentActivity: Array<{
        type: 'auction_created' | 'bid_placed' | 'auction_won' | 'auction_ended';
        auctionId: string;
        auctionTitle: string;
        timestamp: Date;
        amount?: number;
      }>;
      activeParticipation: Array<{
        auctionId: string;
        auctionTitle: string;
        endDate: Date;
        currentBid: number;
        myBid?: number;
        myRank?: number;
        timeRemaining: string;
      }>;
      recommendations: Array<{
        auctionId: string;
        auctionTitle: string;
        matchScore: number;
        reasons: string[];
        urgency: 'high' | 'medium' | 'low';
      }>;
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>('/auctions/dashboard/overview');
      return response.data;
    },

    // Get auction performance metrics
    getPerformanceMetrics: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
      auctionType?: string[];
      serviceCategory?: string[];
    }): Promise<AuctionAPIResponse<{
      metrics: {
        totalAuctions: number;
        averageSavings: number;
        successRate: number;
        averageParticipants: number;
        avgTimeToAward: number;
        customerSatisfaction: number;
      };
      trends: {
        auctionsByMonth: Array<{ month: string; count: number; avgSavings: number }>;
        bidding: Array<{ month: string; avgBids: number; participation: number }>;
        outcomes: Array<{ month: string; awarded: number; cancelled: number; success_rate: number }>;
      };
      insights: {
        topCategories: Array<{ category: string; auctions: number; avgSavings: number }>;
        peakTimes: Array<{ hour: number; activity: number }>;
        success_factors: Array<{ factor: string; impact: number; correlation: number }>;
      };
    }>> => {
      const response = await api.get<AuctionAPIResponse<any>>('/auctions/dashboard/performance', {
        params: filters,
      });
      return response.data;
    },
  },

  // Reports & Export
  reports: {
    // Generate auction report
    generate: async (data: {
      type: 'auction_summary' | 'bidding_analysis' | 'performance_report' | 'cost_savings';
      format: 'pdf' | 'excel' | 'csv';
      dateFrom: string;
      dateTo: string;
      auctions?: string[];
      includeCharts?: boolean;
      filters?: AuctionFilters;
    }): Promise<AuctionAPIResponse<{
      reportUrl: string;
      downloadUrl: string;
      expiresAt: Date;
      reportSize: number;
    }>> => {
      const response = await api.post<AuctionAPIResponse<any>>('/auctions/reports/generate', data);
      return response.data;
    },

    // Export auction data
    exportAuctions: async (filters?: AuctionFilters): Promise<Blob> => {
      const response = await api.get('/auctions/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },

    // Export bid data
    exportBids: async (filters?: BidFilters): Promise<Blob> => {
      const response = await api.get('/auctions/bids/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    },
  },
};

// Legacy API for backward compatibility
export const auctionsAPI = {
  getAll: serviceAuctionsAPI.auctions.getAll,
  getById: serviceAuctionsAPI.auctions.getById,
  placeBid: serviceAuctionsAPI.bids.place,
  getBids: serviceAuctionsAPI.bids.getByAuction,
  getMyBids: serviceAuctionsAPI.bids.getMy,
  buyNow: serviceAuctionsAPI.quickActions.buyNow,
  watch: serviceAuctionsAPI.watchers.watch,
  unwatch: serviceAuctionsAPI.watchers.unwatch,
};

export default serviceAuctionsAPI;
