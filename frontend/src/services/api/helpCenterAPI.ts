import { api } from './client';

// Help Center API Integration with CMS Backend
// Maps frontend help interfaces to backend CMS endpoints

// FAQ Integration
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Help Categories (using CMS pages structure)
export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  slug: string;
}

// Help Article (using CMS pages structure)
export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  isActive: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

// Banner for help center announcements
export interface HelpBanner {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isActive: boolean;
  placement: string;
}

// Integrated Help Center API
export const helpCenterAPI = {
  // FAQs - using CMS FAQ endpoints
  getFAQs: async (params: {
    category?: string;
    limit?: number;
    active?: boolean;
  } = {}) => {
    try {
      const endpoint = params.active ? '/cms/faqs/active' : '/cms/faqs';
      const response = await api.get<FAQ[]>(endpoint, { 
        params: params.category ? { category: params.category } : undefined 
      });
      
      return {
        success: true,
        data: response.data || [],
        message: 'FAQs retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch FAQs'
      };
    }
  },

  // Help Articles - using CMS pages
  getHelpArticles: async (params: {
    category?: string;
    search?: string;
    limit?: number;
  } = {}) => {
    try {
      const response = await api.get<HelpArticle[]>('/cms/pages', { params });
      
      // Filter for help articles (could be identified by category or slug pattern)
      const helpArticles = (response.data || []).filter((page: any) => 
        page.slug?.startsWith('help-') || page.category === 'help'
      );
      
      return {
        success: true,
        data: helpArticles,
        message: 'Help articles retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching help articles:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch help articles'
      };
    }
  },

  // Get single help article by slug
  getHelpArticle: async (slug: string) => {
    try {
      const response = await api.get<HelpArticle>(`/cms/pages/${slug}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Help article retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching help article:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to fetch help article'
      };
    }
  },

  // Banners for help center
  getHelpBanners: async () => {
    try {
      const response = await api.get<HelpBanner[]>('/cms/banners/active', {
        params: { placement: 'help-center' }
      });
      
      return {
        success: true,
        data: response.data || [],
        message: 'Help banners retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching help banners:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch help banners'
      };
    }
  },

  // Search functionality
  searchHelp: async (query: string) => {
    try {
      const [faqsResponse, articlesResponse] = await Promise.all([
        api.get<FAQ[]>('/cms/faqs/active'),
        api.get<HelpArticle[]>('/cms/pages')
      ]);

      const faqs = (faqsResponse.data || []).filter((faq: FAQ) => 
        faq.question.toLowerCase().includes(query.toLowerCase()) ||
        faq.answer.toLowerCase().includes(query.toLowerCase())
      );

      const articles = (articlesResponse.data || []).filter((article: any) => 
        (article.slug?.startsWith('help-') || article.category === 'help') &&
        (article.title.toLowerCase().includes(query.toLowerCase()) ||
         article.content.toLowerCase().includes(query.toLowerCase()))
      );

      return {
        success: true,
        data: {
          faqs,
          articles,
          total: faqs.length + articles.length
        },
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error searching help content:', error);
      return {
        success: false,
        data: { faqs: [], articles: [], total: 0 },
        message: 'Search failed'
      };
    }
  },

  // Get help categories (mock data since CMS doesn't have categories endpoint)
  getHelpCategories: async () => {
    try {
      // Return predefined categories for help center
      const categories: HelpCategory[] = [
        {
          id: '1',
          name: 'Getting Started',
          description: 'Basic guides to help you get started',
          icon: 'RocketOutlined',
          color: '#1890ff',
          articleCount: 0,
          slug: 'getting-started'
        },
        {
          id: '2', 
          name: 'Orders & Shipping',
          description: 'Everything about orders and delivery',
          icon: 'ShoppingOutlined',
          color: '#52c41a',
          articleCount: 0,
          slug: 'orders-shipping'
        },
        {
          id: '3',
          name: 'Account & Billing',
          description: 'Manage your account and billing',
          icon: 'UserOutlined',
          color: '#faad14',
          articleCount: 0,
          slug: 'account-billing'
        },
        {
          id: '4',
          name: 'Technical Support',
          description: 'Technical help and troubleshooting',
          icon: 'SafetyOutlined',
          color: '#f5222d',
          articleCount: 0,
          slug: 'technical-support'
        }
      ];

      return {
        success: true,
        data: categories,
        message: 'Help categories retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching help categories:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch help categories'
      };
    }
  }
};

export default helpCenterAPI;