/**
 * Advanced Search API Services
 * Comprehensive search functionality with AI-powered features
 */
import { api } from './client';

export interface SearchQuery {
  term: string;
  filters: {
    categories?: string[];
    brands?: string[];
    priceRange?: {
      min: number;
      max: number;
      currency: string;
    };
    rating?: {
      min: number;
      max: number;
    };
    attributes?: Array<{
      name: string;
      values: string[];
      operator: 'in' | 'not_in' | 'range' | 'equals';
    }>;
    availability?: 'in_stock' | 'out_of_stock' | 'all';
    location?: {
      radius: number;
      latitude: number;
      longitude: number;
      unit: 'km' | 'miles';
    };
    dateRange?: {
      from: string;
      to: string;
      field: 'created' | 'modified' | 'available_from';
    };
    tags?: string[];
    vendorIds?: string[];
    condition?: 'new' | 'used' | 'refurbished' | 'open_box';
  };
  sort: {
    field: 'relevance' | 'price' | 'rating' | 'popularity' | 'newest' | 'name' | 'discount';
    order: 'asc' | 'desc';
    secondarySort?: {
      field: string;
      order: 'asc' | 'desc';
    };
  };
  pagination: {
    page: number;
    limit: number;
    offset?: number;
  };
  options: {
    includeOutOfStock?: boolean;
    includeFacets?: boolean;
    includeSpellcheck?: boolean;
    includeAutoComplete?: boolean;
    personalized?: boolean;
    includeSuggestions?: boolean;
    highlightMatches?: boolean;
  };
}

export interface SearchResult {
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: {
      current: number;
      original?: number;
      currency: string;
      formatted: string;
    };
    images: Array<{
      url: string;
      alt: string;
      isPrimary: boolean;
    }>;
    rating: {
      average: number;
      count: number;
    };
    vendor: {
      id: string;
      name: string;
      rating: number;
    };
    availability: {
      inStock: boolean;
      quantity: number;
      estimatedDelivery?: string;
    };
    badges: string[];
    highlights?: Record<string, string[]>;
    relevanceScore: number;
    similarProducts?: string[];
  }>;
  facets: Array<{
    name: string;
    displayName: string;
    type: 'checkbox' | 'range' | 'select' | 'color' | 'size';
    values: Array<{
      value: string;
      displayValue: string;
      count: number;
      selected: boolean;
    }>;
    range?: {
      min: number;
      max: number;
      step: number;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  suggestions: {
    spellcheck?: string;
    autoComplete: string[];
    related: string[];
    trending: string[];
  };
  metadata: {
    searchTime: number;
    totalResults: number;
    appliedFilters: Record<string, any>;
    searchId: string;
    userLocation?: string;
  };
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: SearchQuery;
  notifications: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    triggers: Array<'new_results' | 'price_drop' | 'back_in_stock'>;
  };
  stats: {
    resultsCount: number;
    lastExecuted: string;
    executionCount: number;
  };
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchSuggestion {
  id: string;
  type: 'query' | 'product' | 'category' | 'brand' | 'vendor';
  text: string;
  displayText: string;
  category?: string;
  imageUrl?: string;
  popularity: number;
  metadata?: Record<string, any>;
}

export interface SearchAnalytics {
  topQueries: Array<{
    query: string;
    count: number;
    resultsCount: number;
    conversionRate: number;
  }>;
  zeroResultQueries: Array<{
    query: string;
    count: number;
    suggestedActions: string[];
  }>;
  popularFilters: Array<{
    filter: string;
    value: string;
    usage: number;
  }>;
  searchTrends: Array<{
    date: string;
    totalSearches: number;
    uniqueUsers: number;
    averageResultsPerSearch: number;
  }>;
  userBehavior: {
    averageSearchesPerSession: number;
    searchToConversionRate: number;
    averageTimeToConversion: number;
    mostCommonSearchPaths: Array<{
      path: string[];
      frequency: number;
    }>;
  };
}

export const advancedSearchAPI = {
  /**
   * Perform advanced product search
   */
  search: async (searchQuery: SearchQuery): Promise<SearchResult> => {
    const { data } = await api.post('/search/products', searchQuery);
    return data;
  },

  /**
   * Get search suggestions as user types
   */
  getSuggestions: async (
    partialQuery: string,
    type: 'all' | 'query' | 'product' | 'category' = 'all',
    limit: number = 10
  ): Promise<SearchSuggestion[]> => {
    const { data } = await api.get('/search/suggestions', {
      params: { q: partialQuery, type, limit },
    });
    return data;
  },

  /**
   * Get popular/trending search terms
   */
  getTrendingSearches: async (
    period: '24h' | '7d' | '30d' = '24h',
    limit: number = 20
  ): Promise<string[]> => {
    const { data } = await api.get('/search/trending', {
      params: { period, limit },
    });
    return data;
  },

  /**
   * Save a search for later use
   */
  saveSearch: async (searchData: {
    name: string;
    query: SearchQuery;
    notifications?: SavedSearch['notifications'];
    isPublic?: boolean;
    tags?: string[];
  }): Promise<SavedSearch> => {
    const { data } = await api.post('/search/saved', searchData);
    return data;
  },

  /**
   * Get user's saved searches
   */
  getSavedSearches: async (
    userId?: string,
    includePublic: boolean = false
  ): Promise<SavedSearch[]> => {
    const { data } = await api.get('/search/saved', {
      params: { userId, includePublic },
    });
    return data;
  },

  /**
   * Update saved search
   */
  updateSavedSearch: async (
    searchId: string,
    updates: Partial<SavedSearch>
  ): Promise<SavedSearch> => {
    const { data } = await api.put(`/search/saved/${searchId}`, updates);
    return data;
  },

  /**
   * Delete saved search
   */
  deleteSavedSearch: async (searchId: string): Promise<void> => {
    await api.delete(`/search/saved/${searchId}`);
  },

  /**
   * Execute saved search
   */
  executeSavedSearch: async (
    searchId: string,
    overrides?: Partial<SearchQuery>
  ): Promise<SearchResult> => {
    const { data } = await api.post(`/search/saved/${searchId}/execute`, overrides);
    return data;
  },

  /**
   * Get search history for user
   */
  getSearchHistory: async (
    userId: string,
    limit: number = 50,
    includeFilters: boolean = true
  ): Promise<Array<{
    query: SearchQuery;
    timestamp: string;
    resultsCount: number;
    clicked?: boolean;
  }>> => {
    const { data } = await api.get(`/search/history/${userId}`, {
      params: { limit, includeFilters },
    });
    return data;
  },

  /**
   * Clear search history
   */
  clearSearchHistory: async (userId: string): Promise<void> => {
    await api.delete(`/search/history/${userId}`);
  },

  /**
   * Get search facets for building filters
   */
  getFacets: async (
    category?: string,
    query?: string
  ): Promise<SearchResult['facets']> => {
    const { data } = await api.get('/search/facets', {
      params: { category, query },
    });
    return data;
  },

  /**
   * Get similar products based on search context
   */
  getSimilarProducts: async (
    productId: string,
    searchContext?: Partial<SearchQuery>,
    limit: number = 10
  ): Promise<SearchResult['products']> => {
    const { data } = await api.get(`/search/similar/${productId}`, {
      params: { ...searchContext, limit },
    });
    return data;
  },

  /**
   * Visual search using image
   */
  visualSearch: async (
    image: File,
    options?: {
      includeText?: boolean;
      category?: string;
      similarity?: number;
    }
  ): Promise<SearchResult> => {
    const formData = new FormData();
    formData.append('image', image);
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const { data } = await api.post('/search/visual', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Voice search transcription and processing
   */
  voiceSearch: async (
    audioBlob: Blob,
    language: string = 'en-US'
  ): Promise<{
    transcription: string;
    searchResult: SearchResult;
    confidence: number;
  }> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);

    const { data } = await api.post('/search/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Search within specific vendor's catalog
   */
  searchVendor: async (
    vendorId: string,
    query: Partial<SearchQuery>
  ): Promise<SearchResult> => {
    const { data } = await api.post(`/search/vendors/${vendorId}`, query);
    return data;
  },

  /**
   * Barcode/QR code search
   */
  barcodeSearch: async (
    barcode: string,
    type: 'upc' | 'ean' | 'qr' | 'isbn' = 'upc'
  ): Promise<SearchResult> => {
    const { data } = await api.get('/search/barcode', {
      params: { barcode, type },
    });
    return data;
  },

  /**
   * Get search analytics
   */
  getSearchAnalytics: async (
    timeRange: { from: string; to: string },
    vendorId?: string
  ): Promise<SearchAnalytics> => {
    const { data } = await api.get('/search/analytics', {
      params: { ...timeRange, vendorId },
    });
    return data;
  },

  /**
   * Get personalized search recommendations
   */
  getPersonalizedRecommendations: async (
    userId: string,
    context?: {
      currentPage?: string;
      recentViews?: string[];
      searchHistory?: string[];
    }
  ): Promise<{
    recommendedQueries: string[];
    suggestedProducts: SearchResult['products'];
    trendingInYourArea: string[];
  }> => {
    const { data } = await api.post('/search/personalized', {
      userId,
      context,
    });
    return data;
  },

  /**
   * Bulk search for multiple queries
   */
  bulkSearch: async (
    queries: Array<{
      id: string;
      query: SearchQuery;
    }>
  ): Promise<Array<{
    id: string;
    result: SearchResult;
    error?: string;
  }>> => {
    const { data } = await api.post('/search/bulk', { queries });
    return data;
  },

  /**
   * Export search results
   */
  exportSearchResults: async (
    searchQuery: SearchQuery,
    format: 'csv' | 'xlsx' | 'json'
  ): Promise<Blob> => {
    const { data } = await api.post('/search/export', 
      { searchQuery, format },
      { responseType: 'blob' }
    );
    return data;
  },

  /**
   * Track search interaction (click, view, purchase)
   */
  trackSearchInteraction: async (
    searchId: string,
    productId: string,
    action: 'click' | 'view' | 'add_to_cart' | 'purchase',
    metadata?: Record<string, any>
  ): Promise<void> => {
    await api.post('/search/track', {
      searchId,
      productId,
      action,
      metadata,
    });
  },

  /**
   * Get search performance metrics
   */
  getSearchMetrics: async (
    timeRange: { from: string; to: string }
  ): Promise<{
    totalSearches: number;
    uniqueSearches: number;
    averageResultsPerSearch: number;
    zeroResultRate: number;
    clickThroughRate: number;
    conversionRate: number;
    averageSearchTime: number;
  }> => {
    const { data } = await api.get('/search/metrics', {
      params: timeRange,
    });
    return data;
  },
};

export default advancedSearchAPI;