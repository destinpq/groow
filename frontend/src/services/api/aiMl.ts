/**
 * AI/ML API Services
 * Machine Learning, AI-powered features, and intelligent automation
 */
import { api } from './client';

export interface MLModel {
  id: string;
  name: string;
  type: 'recommendation' | 'prediction' | 'classification' | 'clustering' | 'nlp' | 'computer_vision' | 'forecasting';
  version: string;
  description: string;
  algorithm: string;
  framework: 'tensorflow' | 'pytorch' | 'scikit-learn' | 'xgboost' | 'lightgbm' | 'custom';
  status: 'training' | 'ready' | 'deployed' | 'failed' | 'deprecated';
  performance: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    rmse?: number;
    mae?: number;
    r2Score?: number;
    auc?: number;
  };
  training: {
    datasetSize: number;
    trainingTime: number;
    lastTrained: string;
    epochs?: number;
    batchSize?: number;
    learningRate?: number;
    features: string[];
    targetVariable?: string;
  };
  deployment: {
    endpoint: string;
    environment: 'development' | 'staging' | 'production';
    instances: number;
    averageLatency: number;
    requestsPerSecond: number;
    uptime: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    lastUpdated: string;
    tags: string[];
    category: string;
  };
}

export interface RecommendationRequest {
  userId?: string;
  sessionId?: string;
  type: 'product' | 'content' | 'vendor' | 'category' | 'search';
  context: {
    currentItem?: string;
    currentCategory?: string;
    viewHistory?: string[];
    purchaseHistory?: string[];
    searchHistory?: string[];
    preferences?: Record<string, any>;
    demographics?: {
      age?: number;
      gender?: string;
      location?: string;
      interests?: string[];
    };
    device?: string;
    timeOfDay?: string;
    seasonality?: string;
  };
  filters?: {
    priceRange?: { min: number; max: number };
    categories?: string[];
    brands?: string[];
    vendors?: string[];
    excludeItems?: string[];
    inStock?: boolean;
    rating?: number;
  };
  options: {
    count: number;
    diversityScore?: number; // 0-1, higher = more diverse
    explanations?: boolean;
    includeSimilar?: boolean;
    includeNewItems?: boolean;
    personalizedWeight?: number; // 0-1, higher = more personalized
  };
}

export interface RecommendationResponse {
  items: Array<{
    id: string;
    score: number;
    confidence: number;
    type: string;
    metadata: Record<string, any>;
    explanation?: {
      reason: string;
      factors: Array<{
        factor: string;
        weight: number;
        description: string;
      }>;
    };
  }>;
  metadata: {
    algorithm: string;
    processingTime: number;
    totalCandidates: number;
    filters: Record<string, any>;
    requestId: string;
  };
  abTest?: {
    variant: string;
    experimentId: string;
  };
}

export interface SentimentAnalysis {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number;
  emotions?: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
    disgust?: number;
  };
  aspects?: Array<{
    aspect: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    mentions: number;
  }>;
  keywords?: Array<{
    word: string;
    relevance: number;
    sentiment: number;
  }>;
}

export interface TextAnalysis {
  id: string;
  text: string;
  language: string;
  confidence: number;
  analysis: {
    sentiment: SentimentAnalysis;
    topics: Array<{
      topic: string;
      confidence: number;
      keywords: string[];
    }>;
    entities: Array<{
      text: string;
      type: 'person' | 'organization' | 'location' | 'product' | 'brand' | 'other';
      confidence: number;
      startOffset: number;
      endOffset: number;
    }>;
    intent?: {
      intent: string;
      confidence: number;
      parameters?: Record<string, any>;
    };
    classification?: Array<{
      category: string;
      confidence: number;
    }>;
  };
  metadata: {
    processedAt: string;
    processingTime: number;
    modelVersion: string;
  };
}

export interface ImageAnalysis {
  id: string;
  imageUrl: string;
  analysis: {
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    faces?: Array<{
      confidence: number;
      age?: { min: number; max: number };
      gender?: string;
      emotions?: Record<string, number>;
      boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    text?: Array<{
      text: string;
      confidence: number;
      boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    colors: Array<{
      color: string;
      percentage: number;
      hex: string;
    }>;
    style?: {
      type: string;
      confidence: number;
    };
    unsafe?: {
      adult: boolean;
      violence: boolean;
      racy: boolean;
      scores: Record<string, number>;
    };
    quality: {
      brightness: number;
      contrast: number;
      sharpness: number;
      noise: number;
    };
  };
  metadata: {
    processedAt: string;
    processingTime: number;
    imageSize: { width: number; height: number };
    modelVersion: string;
  };
}

export interface PredictionRequest {
  modelId: string;
  features: Record<string, any>;
  options?: {
    explainPrediction?: boolean;
    confidence?: boolean;
    alternatives?: number;
  };
}

export interface PredictionResponse {
  prediction: any;
  confidence?: number;
  probability?: Record<string, number>;
  explanation?: {
    featureImportance: Array<{
      feature: string;
      importance: number;
      value: any;
    }>;
    reasoning: string;
  };
  alternatives?: Array<{
    prediction: any;
    confidence: number;
  }>;
  metadata: {
    modelId: string;
    modelVersion: string;
    processingTime: number;
    requestId: string;
  };
}

export interface ChatbotConversation {
  id: string;
  userId?: string;
  sessionId: string;
  type: 'customer_service' | 'sales' | 'technical_support' | 'general';
  status: 'active' | 'resolved' | 'escalated' | 'abandoned';
  messages: Array<{
    id: string;
    type: 'user' | 'bot' | 'human_agent';
    content: {
      text?: string;
      buttons?: Array<{
        text: string;
        action: string;
        payload?: any;
      }>;
      carousel?: Array<{
        title: string;
        subtitle?: string;
        imageUrl?: string;
        buttons?: Array<{
          text: string;
          action: string;
          payload?: any;
        }>;
      }>;
      quickReplies?: string[];
    };
    intent?: {
      name: string;
      confidence: number;
      entities?: Record<string, any>;
    };
    context?: Record<string, any>;
    timestamp: string;
  }>;
  context: {
    userProfile?: Record<string, any>;
    sessionData: Record<string, any>;
    previousConversations?: string[];
    escalationReasons?: string[];
  };
  analytics: {
    duration?: number;
    messageCount: number;
    userSatisfaction?: number;
    resolved: boolean;
    escalated: boolean;
    containment: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ForecastRequest {
  dataType: 'sales' | 'demand' | 'inventory' | 'price' | 'traffic' | 'revenue';
  timeRange: {
    start: string;
    end: string;
  };
  granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter';
  horizonPeriods: number;
  filters?: {
    productIds?: string[];
    categories?: string[];
    vendors?: string[];
    regions?: string[];
  };
  options?: {
    includeConfidenceIntervals?: boolean;
    seasonalityFactors?: string[];
    externalFactors?: Record<string, any>;
  };
}

export interface ForecastResponse {
  forecast: Array<{
    period: string;
    value: number;
    lower?: number;
    upper?: number;
    confidence?: number;
  }>;
  accuracy: {
    mae: number;
    mape: number;
    rmse: number;
    r2: number;
  };
  insights: {
    trend: 'increasing' | 'decreasing' | 'stable';
    seasonality: Array<{
      pattern: string;
      strength: number;
    }>;
    anomalies?: Array<{
      period: string;
      type: 'spike' | 'drop' | 'shift';
      severity: number;
    }>;
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
  };
  metadata: {
    modelUsed: string;
    dataPoints: number;
    processingTime: number;
    generatedAt: string;
  };
}

export const aiMlAPI = {
  /**
   * Get product recommendations
   */
  getRecommendations: async (
    request: RecommendationRequest
  ): Promise<RecommendationResponse> => {
    const { data } = await api.post('/ai/recommendations', request);
    return data;
  },

  /**
   * Get personalized recommendations for user
   */
  getPersonalizedRecommendations: async (
    userId: string,
    type: RecommendationRequest['type'],
    options?: Partial<RecommendationRequest['options']>
  ): Promise<RecommendationResponse> => {
    const { data } = await api.get(`/ai/recommendations/users/${userId}`, {
      params: { type, ...options },
    });
    return data;
  },

  /**
   * Get similar items recommendations
   */
  getSimilarItems: async (
    itemId: string,
    type: RecommendationRequest['type'],
    count: number = 10
  ): Promise<RecommendationResponse> => {
    const { data } = await api.get(`/ai/recommendations/similar/${itemId}`, {
      params: { type, count },
    });
    return data;
  },

  /**
   * Track recommendation interaction
   */
  trackRecommendationInteraction: async (
    requestId: string,
    itemId: string,
    action: 'view' | 'click' | 'purchase' | 'dismiss' | 'like' | 'dislike',
    metadata?: Record<string, any>
  ): Promise<void> => {
    await api.post('/ai/recommendations/track', {
      requestId,
      itemId,
      action,
      metadata,
    });
  },

  /**
   * Analyze text sentiment
   */
  analyzeSentiment: async (
    text: string,
    options?: {
      includeEmotions?: boolean;
      includeAspects?: boolean;
      includeKeywords?: boolean;
      language?: string;
    }
  ): Promise<SentimentAnalysis> => {
    const { data } = await api.post('/ai/text/sentiment', {
      text,
      ...options,
    });
    return data;
  },

  /**
   * Comprehensive text analysis
   */
  analyzeText: async (
    text: string,
    analysisTypes: Array<'sentiment' | 'topics' | 'entities' | 'intent' | 'classification'>,
    options?: {
      language?: string;
      domain?: string;
    }
  ): Promise<TextAnalysis> => {
    const { data } = await api.post('/ai/text/analyze', {
      text,
      analysisTypes,
      ...options,
    });
    return data;
  },

  /**
   * Analyze image content
   */
  analyzeImage: async (
    imageUrl: string,
    analysisTypes: Array<'objects' | 'faces' | 'text' | 'colors' | 'style' | 'unsafe' | 'quality'>
  ): Promise<ImageAnalysis> => {
    const { data } = await api.post('/ai/image/analyze', {
      imageUrl,
      analysisTypes,
    });
    return data;
  },

  /**
   * Upload and analyze image file
   */
  uploadAndAnalyzeImage: async (
    imageFile: File,
    analysisTypes: Array<'objects' | 'faces' | 'text' | 'colors' | 'style' | 'unsafe' | 'quality'>
  ): Promise<ImageAnalysis> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('analysisTypes', JSON.stringify(analysisTypes));

    const { data } = await api.post('/ai/image/upload-analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Make prediction using ML model
   */
  predict: async (request: PredictionRequest): Promise<PredictionResponse> => {
    const { data } = await api.post('/ai/predict', request);
    return data;
  },

  /**
   * Batch predictions
   */
  batchPredict: async (
    modelId: string,
    requests: Array<{
      id: string;
      features: Record<string, any>;
    }>
  ): Promise<Array<PredictionResponse & { id: string }>> => {
    const { data } = await api.post('/ai/predict/batch', {
      modelId,
      requests,
    });
    return data;
  },

  /**
   * Start chatbot conversation
   */
  startChatbot: async (
    sessionId: string,
    type: ChatbotConversation['type'],
    initialMessage?: string,
    context?: Record<string, any>
  ): Promise<ChatbotConversation> => {
    const { data } = await api.post('/ai/chatbot/start', {
      sessionId,
      type,
      initialMessage,
      context,
    });
    return data;
  },

  /**
   * Send message to chatbot
   */
  sendChatbotMessage: async (
    conversationId: string,
    message: string,
    context?: Record<string, any>
  ): Promise<{
    response: ChatbotConversation['messages'][0];
    conversation: ChatbotConversation;
  }> => {
    const { data } = await api.post(`/ai/chatbot/${conversationId}/message`, {
      message,
      context,
    });
    return data;
  },

  /**
   * Get chatbot conversation
   */
  getChatbotConversation: async (
    conversationId: string
  ): Promise<ChatbotConversation> => {
    const { data } = await api.get(`/ai/chatbot/${conversationId}`);
    return data;
  },

  /**
   * End chatbot conversation
   */
  endChatbotConversation: async (
    conversationId: string,
    feedback?: {
      satisfaction: number;
      resolved: boolean;
      comments?: string;
    }
  ): Promise<ChatbotConversation> => {
    const { data } = await api.post(`/ai/chatbot/${conversationId}/end`, feedback);
    return data;
  },

  /**
   * Escalate to human agent
   */
  escalateChatbot: async (
    conversationId: string,
    reason: string
  ): Promise<ChatbotConversation> => {
    const { data } = await api.post(`/ai/chatbot/${conversationId}/escalate`, {
      reason,
    });
    return data;
  },

  /**
   * Generate forecast
   */
  generateForecast: async (request: ForecastRequest): Promise<ForecastResponse> => {
    const { data } = await api.post('/ai/forecast', request);
    return data;
  },

  /**
   * Get demand forecast for products
   */
  getDemandForecast: async (
    productIds: string[],
    horizonDays: number,
    options?: {
      includeSeasonality?: boolean;
      includePromo?: boolean;
      confidenceLevel?: number;
    }
  ): Promise<{
    forecasts: Array<{
      productId: string;
      forecast: ForecastResponse['forecast'];
      insights: ForecastResponse['insights'];
    }>;
    aggregated: ForecastResponse['forecast'];
  }> => {
    const { data } = await api.post('/ai/forecast/demand', {
      productIds,
      horizonDays,
      ...options,
    });
    return data;
  },

  /**
   * Get price optimization recommendations
   */
  getPriceOptimization: async (
    productId: string,
    options?: {
      competitorPrices?: Array<{ vendor: string; price: number }>;
      targetMargin?: number;
      demandElasticity?: number;
      seasonality?: boolean;
    }
  ): Promise<{
    recommendedPrice: number;
    currentPrice: number;
    priceRange: { min: number; max: number };
    expectedImpact: {
      demandChange: number;
      revenueChange: number;
      marginChange: number;
    };
    strategy: string;
    reasoning: string[];
    confidence: number;
  }> => {
    const { data } = await api.post(`/ai/pricing/optimize/${productId}`, options);
    return data;
  },

  /**
   * Detect anomalies in data
   */
  detectAnomalies: async (
    dataType: 'sales' | 'traffic' | 'user_behavior' | 'inventory' | 'performance',
    timeRange: { start: string; end: string },
    filters?: Record<string, any>
  ): Promise<{
    anomalies: Array<{
      timestamp: string;
      value: number;
      expected: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      type: 'spike' | 'drop' | 'shift' | 'trend_change';
      description: string;
      confidence: number;
    }>;
    summary: {
      totalAnomalies: number;
      severityBreakdown: Record<string, number>;
      typeBreakdown: Record<string, number>;
      period: { start: string; end: string };
    };
  }> => {
    const { data } = await api.post('/ai/anomalies/detect', {
      dataType,
      timeRange,
      filters,
    });
    return data;
  },

  /**
   * Get customer lifetime value prediction
   */
  predictCLV: async (
    userId: string,
    timeHorizonMonths: number = 12
  ): Promise<{
    predictedCLV: number;
    confidence: number;
    breakdown: {
      averageOrderValue: number;
      purchaseFrequency: number;
      retentionProbability: number;
      churnProbability: number;
    };
    insights: {
      segment: string;
      riskLevel: 'low' | 'medium' | 'high';
      recommendations: string[];
    };
  }> => {
    const { data } = await api.get(`/ai/clv/predict/${userId}`, {
      params: { timeHorizonMonths },
    });
    return data;
  },

  /**
   * Get churn prediction
   */
  predictChurn: async (
    userId: string
  ): Promise<{
    churnProbability: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    timeToChurn?: number; // days
    retentionStrategies: Array<{
      strategy: string;
      effectiveness: number;
      effort: 'low' | 'medium' | 'high';
    }>;
  }> => {
    const { data } = await api.get(`/ai/churn/predict/${userId}`);
    return data;
  },

  /**
   * Generate content using AI
   */
  generateContent: async (
    type: 'product_description' | 'marketing_copy' | 'email_template' | 'social_media' | 'blog_post',
    prompt: string,
    options?: {
      tone?: 'professional' | 'casual' | 'friendly' | 'persuasive' | 'technical';
      length?: 'short' | 'medium' | 'long';
      audience?: string;
      keywords?: string[];
      context?: Record<string, any>;
    }
  ): Promise<{
    content: string;
    alternatives?: string[];
    metadata: {
      wordCount: number;
      readabilityScore: number;
      sentimentScore: number;
      confidence: number;
    };
  }> => {
    const { data } = await api.post('/ai/content/generate', {
      type,
      prompt,
      ...options,
    });
    return data;
  },

  /**
   * Get ML model information
   */
  getModel: async (modelId: string): Promise<MLModel> => {
    const { data } = await api.get(`/ai/models/${modelId}`);
    return data;
  },

  /**
   * List available ML models
   */
  getModels: async (
    type?: MLModel['type'],
    status?: MLModel['status']
  ): Promise<MLModel[]> => {
    const { data } = await api.get('/ai/models', {
      params: { type, status },
    });
    return data;
  },

  /**
   * Get model performance metrics
   */
  getModelPerformance: async (
    modelId: string,
    timeRange?: { start: string; end: string }
  ): Promise<{
    metrics: MLModel['performance'];
    usage: {
      totalRequests: number;
      averageLatency: number;
      errorRate: number;
      throughput: number;
    };
    accuracy: {
      overall: number;
      bySegment: Record<string, number>;
      trend: Array<{
        date: string;
        accuracy: number;
      }>;
    };
  }> => {
    const { data } = await api.get(`/ai/models/${modelId}/performance`, {
      params: timeRange,
    });
    return data;
  },

  /**
   * Retrain model with new data
   */
  retrainModel: async (
    modelId: string,
    options?: {
      incremental?: boolean;
      datasetIds?: string[];
      hyperparameters?: Record<string, any>;
    }
  ): Promise<{
    trainingJobId: string;
    estimatedTime: number;
    status: 'queued' | 'running';
  }> => {
    const { data } = await api.post(`/ai/models/${modelId}/retrain`, options);
    return data;
  },

  /**
   * A/B test AI features
   */
  runAIExperiment: async (
    experimentConfig: {
      name: string;
      type: 'recommendation' | 'pricing' | 'content' | 'chatbot';
      variants: Array<{
        id: string;
        config: Record<string, any>;
        traffic: number; // percentage
      }>;
      metrics: string[];
      duration?: number; // days
    }
  ): Promise<{
    experimentId: string;
    status: 'running' | 'scheduled';
    startTime: string;
    endTime: string;
  }> => {
    const { data } = await api.post('/ai/experiments', experimentConfig);
    return data;
  },

  /**
   * Get experiment results
   */
  getExperimentResults: async (
    experimentId: string
  ): Promise<{
    status: 'running' | 'completed' | 'stopped';
    results: Array<{
      variant: string;
      metrics: Record<string, number>;
      sampleSize: number;
      confidence: number;
    }>;
    winner?: string;
    insights: string[];
  }> => {
    const { data } = await api.get(`/ai/experiments/${experimentId}/results`);
    return data;
  },
};

export default aiMlAPI;