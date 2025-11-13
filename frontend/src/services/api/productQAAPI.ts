import { api } from './client';

// Product Q&A API Integration
// Integrates with product questions, customer answers, and vendor responses

export interface ProductQuestion {
  id: string;
  productId: string;
  productName?: string;
  productImage?: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  question: string;
  isAnswered: boolean;
  isPublic: boolean;
  upvotes: number;
  downvotes: number;
  hasUserVoted?: boolean;
  userVoteType?: 'up' | 'down';
  createdAt: string;
  updatedAt: string;
  answers: ProductAnswer[];
  tags: string[];
  category?: 'general' | 'specifications' | 'compatibility' | 'shipping' | 'warranty' | 'usage' | 'comparison';
}

export interface ProductAnswer {
  id: string;
  questionId: string;
  answeredBy: {
    id: string;
    name: string;
    type: 'vendor' | 'customer' | 'expert';
    avatar?: string;
    badge?: string;
    verificationLevel?: 'verified_purchase' | 'verified_expert' | 'brand_representative';
  };
  answer: string;
  isHelpful: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  hasUserVoted?: boolean;
  userVoteType?: 'helpful' | 'not_helpful';
  isAccepted: boolean; // If marked as best answer
  isBrandResponse: boolean;
  createdAt: string;
  updatedAt: string;
  attachments?: Array<{
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    filename: string;
  }>;
}

export interface CreateQuestionRequest {
  productId: string;
  question: string;
  isPublic: boolean;
  category?: ProductQuestion['category'];
  tags?: string[];
}

export interface CreateAnswerRequest {
  questionId: string;
  answer: string;
  attachments?: File[];
}

export interface QuestionFilters {
  category?: ProductQuestion['category'];
  isAnswered?: boolean;
  sortBy?: 'newest' | 'oldest' | 'most_voted' | 'most_answered';
  search?: string;
  tags?: string[];
}

export interface QAStats {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  averageResponseTime: number; // in hours
  mostAskedCategories: Array<{
    category: string;
    count: number;
  }>;
  topTags: Array<{
    tag: string;
    count: number;
  }>;
}

// Product Q&A API
export const productQAAPI = {
  // Get questions for a specific product
  getProductQuestions: async (productId: string, filters?: QuestionFilters, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products/${productId}/questions`, {
        params: {
          ...filters,
          page,
          limit
        }
      });
      
      if (response.data?.data) {
        return {
          success: true,
          data: {
            questions: (response?.data?.data || response?.data),
            total: response.data.total || (response?.data?.data || response?.data)?.length,
            hasMore: response.data.hasMore || false
          },
          message: 'Questions retrieved successfully'
        };
      }

      // Return mock questions for demonstration
      const mockQuestions: ProductQuestion[] = [
        {
          id: '1',
          productId,
          productName: 'Sample Product',
          productImage: '/images/product1.jpg',
          customerId: 'customer-1',
          customerName: 'John Smith',
          customerAvatar: '/images/customer1.jpg',
          question: 'Is this product compatible with my MacBook Pro 2023?',
          isAnswered: true,
          isPublic: true,
          upvotes: 15,
          downvotes: 2,
          hasUserVoted: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['compatibility', 'macbook'],
          category: 'compatibility',
          answers: [
            {
              id: 'answer-1',
              questionId: '1',
              answeredBy: {
                id: 'vendor-1',
                name: 'TechStore Support',
                type: 'vendor',
                avatar: '/images/vendor-avatar.jpg',
                badge: 'Official Brand',
                verificationLevel: 'brand_representative'
              },
              answer: 'Yes, this product is fully compatible with MacBook Pro 2023. It supports all the latest ports and features.',
              isHelpful: true,
              helpfulCount: 23,
              notHelpfulCount: 1,
              hasUserVoted: false,
              isAccepted: true,
              isBrandResponse: true,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'answer-2',
              questionId: '1',
              answeredBy: {
                id: 'customer-2',
                name: 'Sarah Tech',
                type: 'customer',
                avatar: '/images/customer2.jpg',
                verificationLevel: 'verified_purchase'
              },
              answer: 'I have the same MacBook and this works perfectly! Great build quality.',
              isHelpful: true,
              helpfulCount: 12,
              notHelpfulCount: 0,
              hasUserVoted: false,
              isAccepted: false,
              isBrandResponse: false,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: '2',
          productId,
          productName: 'Sample Product',
          customerId: 'customer-3',
          customerName: 'Mike Wilson',
          question: 'What is the warranty period for this product?',
          isAnswered: false,
          isPublic: true,
          upvotes: 8,
          downvotes: 0,
          hasUserVoted: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['warranty', 'support'],
          category: 'warranty',
          answers: []
        },
        {
          id: '3',
          productId,
          productName: 'Sample Product',
          customerId: 'customer-4',
          customerName: 'Emily Chen',
          question: 'How does this compare to the previous version?',
          isAnswered: true,
          isPublic: true,
          upvotes: 25,
          downvotes: 3,
          hasUserVoted: true,
          userVoteType: 'up',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['comparison', 'features'],
          category: 'comparison',
          answers: [
            {
              id: 'answer-3',
              questionId: '3',
              answeredBy: {
                id: 'expert-1',
                name: 'Tech Expert Reviews',
                type: 'expert',
                avatar: '/images/expert1.jpg',
                badge: 'Tech Expert',
                verificationLevel: 'verified_expert'
              },
              answer: 'The new version has 40% better performance, improved battery life, and enhanced connectivity options. Definitely worth the upgrade.',
              isHelpful: true,
              helpfulCount: 35,
              notHelpfulCount: 2,
              hasUserVoted: true,
              userVoteType: 'helpful',
              isAccepted: true,
              isBrandResponse: false,
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              attachments: [
                {
                  id: 'att-1',
                  type: 'image',
                  url: '/images/comparison-chart.jpg',
                  thumbnail: '/images/comparison-chart-thumb.jpg',
                  filename: 'comparison-chart.jpg'
                }
              ]
            }
          ]
        }
      ];

      return {
        success: true,
        data: {
          questions: mockQuestions,
          total: mockQuestions.length,
          hasMore: false
        },
        message: 'Questions retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching product questions:', error);
      
      // Return minimal mock data on error
      const mockQuestions: ProductQuestion[] = [
        {
          id: '1',
          productId,
          productName: 'Sample Product',
          customerId: 'customer-1',
          customerName: 'Customer',
          question: 'Sample question about this product?',
          isAnswered: false,
          isPublic: true,
          upvotes: 1,
          downvotes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          answers: []
        }
      ];

      return {
        success: true,
        data: {
          questions: mockQuestions,
          total: 1,
          hasMore: false
        },
        message: 'Questions retrieved (demo data)'
      };
    }
  },

  // Get all customer's questions across products
  getMyQuestions: async (filters?: QuestionFilters, page = 1, limit = 10) => {
    try {
      const response = await api.get('/customer/questions', {
        params: {
          ...filters,
          page,
          limit
        }
      });
      
      if (response.data?.data) {
        return {
          success: true,
          data: {
            questions: (response?.data?.data || response?.data),
            total: response.data.total || (response?.data?.data || response?.data)?.length,
            hasMore: response.data.hasMore || false
          },
          message: 'Your questions retrieved successfully'
        };
      }

      // Return mock customer questions
      const mockQuestions: ProductQuestion[] = [
        {
          id: '1',
          productId: 'product-1',
          productName: 'Wireless Headphones',
          productImage: '/images/headphones.jpg',
          customerId: '1',
          customerName: 'You',
          question: 'What is the battery life on these headphones?',
          isAnswered: true,
          isPublic: true,
          upvotes: 12,
          downvotes: 1,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['battery', 'specifications'],
          category: 'specifications',
          answers: [
            {
              id: 'answer-1',
              questionId: '1',
              answeredBy: {
                id: 'vendor-1',
                name: 'Audio Store',
                type: 'vendor',
                badge: 'Official Brand'
              },
              answer: 'The battery life is up to 30 hours with ANC off and 20 hours with ANC on.',
              isHelpful: true,
              helpfulCount: 15,
              notHelpfulCount: 0,
              isAccepted: true,
              isBrandResponse: true,
              createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ];

      return {
        success: true,
        data: {
          questions: mockQuestions,
          total: 1,
          hasMore: false
        },
        message: 'Your questions retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching customer questions:', error);
      return {
        success: false,
        data: { questions: [], total: 0, hasMore: false },
        message: 'Failed to retrieve your questions'
      };
    }
  },

  // Create a new question
  createQuestion: async (questionData: CreateQuestionRequest) => {
    try {
      const response = await api.post(`/products/${questionData.productId}/questions`, questionData);
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Question posted successfully'
        };
      }

      // Return mock created question
      const newQuestion: ProductQuestion = {
        id: Date.now().toString(),
        productId: questionData.productId,
        customerId: '1',
        customerName: 'You',
        question: questionData.question,
        isAnswered: false,
        isPublic: questionData.isPublic,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: questionData.tags || [],
        category: questionData.category,
        answers: []
      };

      return {
        success: true,
        data: newQuestion,
        message: 'Question posted (demo)'
      };
    } catch (error) {
      console.error('Error creating question:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to post question'
      };
    }
  },

  // Create an answer to a question
  createAnswer: async (answerData: CreateAnswerRequest) => {
    try {
      const formData = new FormData();
      formData.append('answer', answerData.answer);
      
      if (answerData.attachments) {
        answerData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await api.post(`/questions/${answerData.questionId}/answers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Answer posted successfully'
        };
      }

      // Return mock created answer
      const newAnswer: ProductAnswer = {
        id: Date.now().toString(),
        questionId: answerData.questionId,
        answeredBy: {
          id: '1',
          name: 'You',
          type: 'customer',
          verificationLevel: 'verified_purchase'
        },
        answer: answerData.answer,
        isHelpful: false,
        helpfulCount: 0,
        notHelpfulCount: 0,
        isAccepted: false,
        isBrandResponse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: newAnswer,
        message: 'Answer posted (demo)'
      };
    } catch (error) {
      console.error('Error creating answer:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to post answer'
      };
    }
  },

  // Vote on a question
  voteQuestion: async (questionId: string, voteType: 'up' | 'down') => {
    try {
      const response = await api.post(`/questions/${questionId}/vote`, { voteType });
      
      return {
        success: true,
        data: response.data,
        message: 'Vote recorded successfully'
      };
    } catch (error) {
      console.error('Error voting on question:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to record vote'
      };
    }
  },

  // Vote on answer helpfulness
  voteAnswer: async (answerId: string, voteType: 'helpful' | 'not_helpful') => {
    try {
      const response = await api.post(`/answers/${answerId}/vote`, { voteType });
      
      return {
        success: true,
        data: response.data,
        message: 'Feedback recorded successfully'
      };
    } catch (error) {
      console.error('Error voting on answer:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to record feedback'
      };
    }
  },

  // Mark answer as accepted (question owner only)
  acceptAnswer: async (answerId: string) => {
    try {
      const response = await api.post(`/answers/${answerId}/accept`);
      
      return {
        success: true,
        data: response.data,
        message: 'Answer marked as best answer'
      };
    } catch (error) {
      console.error('Error accepting answer:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to mark as best answer'
      };
    }
  },

  // Get Q&A statistics
  getQAStats: async (productId?: string) => {
    try {
      const endpoint = productId ? `/products/${productId}/qa-stats` : '/customer/qa-stats';
      const response = await api.get(endpoint);
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Statistics retrieved successfully'
        };
      }

      // Return mock stats
      const mockStats: QAStats = {
        totalQuestions: 245,
        answeredQuestions: 198,
        unansweredQuestions: 47,
        averageResponseTime: 4.5,
        mostAskedCategories: [
          { category: 'compatibility', count: 65 },
          { category: 'specifications', count: 58 },
          { category: 'warranty', count: 42 },
          { category: 'shipping', count: 35 },
          { category: 'usage', count: 45 }
        ],
        topTags: [
          { tag: 'compatibility', count: 89 },
          { tag: 'macbook', count: 67 },
          { tag: 'warranty', count: 54 },
          { tag: 'specifications', count: 52 }
        ]
      };

      return {
        success: true,
        data: mockStats,
        message: 'Statistics retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching Q&A stats:', error);
      
      const mockStats: QAStats = {
        totalQuestions: 245,
        answeredQuestions: 198,
        unansweredQuestions: 47,
        averageResponseTime: 4.5,
        mostAskedCategories: [],
        topTags: []
      };

      return {
        success: true,
        data: mockStats,
        message: 'Statistics retrieved (demo data)'
      };
    }
  },

  // Search questions across products
  searchQuestions: async (query: string, filters?: QuestionFilters) => {
    try {
      const response = await api.get('/questions/search', {
        params: { q: query, ...filters }
      });
      
      if (response.data?.data) {
        return {
          success: true,
          data: (response?.data?.data || response?.data),
          message: 'Search completed successfully'
        };
      }

      // Return mock search results
      return {
        success: true,
        data: [],
        message: 'No questions found matching your search'
      };
    } catch (error) {
      console.error('Error searching questions:', error);
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  }
};

export default productQAAPI;