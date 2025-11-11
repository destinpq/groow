/**
 * Localization API Services
 * Multi-language support, cultural adaptation, and internationalization management
 */
import { api } from './client';

export interface Language {
  id: string;
  code: string; // ISO 639-1 code (e.g., 'en', 'es', 'fr')
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  family: string; // language family (e.g., 'Germanic', 'Romance')
  script: string; // writing system (e.g., 'Latin', 'Arabic', 'Cyrillic')
  regions: Array<{
    code: string; // ISO 3166-1 alpha-2 (e.g., 'US', 'ES', 'FR')
    name: string;
    locale: string; // language-region (e.g., 'en-US', 'es-ES', 'fr-FR')
    primary: boolean;
    population: number;
  }>;
  status: 'active' | 'beta' | 'maintenance' | 'deprecated';
  support: {
    ui: boolean;
    content: boolean;
    rtl: boolean;
    ime: boolean; // input method editor
    pluralization: boolean;
    collation: boolean; // sorting rules
    calendar: boolean;
    currency: boolean;
  };
  statistics: {
    speakers: {
      native: number;
      total: number;
      online: number; // internet users
    };
    coverage: {
      translations: number; // percentage translated
      reviews: number; // percentage reviewed
      approved: number; // percentage approved
    };
    usage: {
      sessions: number;
      users: number;
      revenue: number;
      conversion: number; // percentage
    };
  };
  quality: {
    score: number; // 0-100
    completeness: number; // percentage
    consistency: number; // percentage
    fluency: number; // 0-10
    accuracy: number; // 0-10
    cultural: number; // 0-10 cultural appropriateness
  };
  resources: {
    translators: Array<{
      id: string;
      type: 'human' | 'machine' | 'hybrid';
      name: string;
      rating: number; // 0-5
      specializations: string[];
      active: boolean;
    }>;
    glossaries: Array<{
      id: string;
      name: string;
      domain: string;
      terms: number;
      lastUpdated: string;
    }>;
    styleguides: Array<{
      id: string;
      name: string;
      type: 'corporate' | 'technical' | 'marketing' | 'legal';
      version: string;
      url?: string;
    }>;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface TranslationKey {
  id: string;
  key: string;
  namespace: string;
  context?: string;
  description: string;
  category: 'ui' | 'content' | 'error' | 'notification' | 'marketing' | 'legal' | 'help';
  type: 'text' | 'html' | 'markdown' | 'json' | 'plural' | 'interpolation';
  source: {
    text: string;
    language: string;
    author: string;
    createdAt: string;
    version: number;
  };
  keyMetadata: {
    maxLength?: number;
    variables?: Array<{
      name: string;
      type: 'string' | 'number' | 'date' | 'currency' | 'html';
      required: boolean;
      description?: string;
    }>;
    placeholders?: Array<{
      key: string;
      description: string;
      example: string;
    }>;
    pluralization?: {
      forms: string[]; // zero, one, two, few, many, other
      rules: Record<string, string>;
    };
    formatting?: {
      preserve: string[]; // HTML tags, variables to preserve
      transform: string[]; // transformations to apply
    };
  };
  translations: Record<string, {
    text: string;
    status: 'pending' | 'translated' | 'reviewed' | 'approved' | 'rejected';
    quality: number; // 0-100
    translator: {
      id: string;
      type: 'human' | 'machine' | 'hybrid';
      name: string;
    };
    reviewer?: {
      id: string;
      name: string;
      reviewedAt: string;
      notes?: string;
    };
    history: Array<{
      version: number;
      text: string;
      translatedAt: string;
      translatedBy: string;
      changes?: string;
    }>;
    metrics: {
      confidence: number; // 0-100
      fuzzyMatch: number; // 0-100 (for translation memory)
      editDistance: number; // changes from previous version
      timeToTranslate: number; // seconds
      wordCount: number;
    };
  }>;
  usage: {
    frequency: number; // how often this key is accessed
    platforms: string[]; // web, mobile, api, etc.
    features: string[]; // which features use this key
    lastUsed: string;
    deprecated: boolean;
    replacedBy?: string;
  };
  workflow: {
    status: 'draft' | 'ready' | 'in_translation' | 'in_review' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    deadline?: string;
    assignedTo?: Array<{
      role: 'translator' | 'reviewer' | 'approver';
      userId: string;
      language?: string;
      assignedAt: string;
    }>;
    comments: Array<{
      id: string;
      author: string;
      text: string;
      timestamp: string;
      language?: string;
      type: 'question' | 'suggestion' | 'issue' | 'approval';
    }>;
  };
  validation: {
    rules: Array<{
      type: 'length' | 'format' | 'content' | 'terminology' | 'consistency';
      condition: string;
      message: string;
      severity: 'info' | 'warning' | 'error';
    }>;
    results: Record<string, Array<{
      rule: string;
      status: 'pass' | 'warning' | 'fail';
      message: string;
      details?: any;
    }>>;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    customFields: Record<string, any>;
  };
}

export interface Locale {
  id: string;
  code: string; // language-region format (e.g., 'en-US', 'es-MX')
  language: string;
  region: string;
  displayName: string;
  nativeDisplayName: string;
  enabled: boolean;
  primary: boolean;
  fallback?: string; // fallback locale code
  formatting: {
    numbers: {
      decimal: string; // decimal separator
      thousands: string; // thousands separator
      currency: {
        symbol: string;
        position: 'before' | 'after';
        space: boolean;
      };
      percent: {
        symbol: string;
        position: 'before' | 'after';
      };
    };
    dates: {
      short: string; // date format pattern
      medium: string;
      long: string;
      time: string;
      timezone: string;
      firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
      calendar: 'gregorian' | 'hijri' | 'buddhist' | 'chinese' | 'hebrew';
    };
    addresses: {
      format: string; // address format pattern
      postalCodePattern?: string;
      phonePattern?: string;
    };
    names: {
      order: 'given-family' | 'family-given';
      formality: 'formal' | 'informal' | 'mixed';
      titles: string[];
    };
  };
  content: {
    direction: 'ltr' | 'rtl';
    charset: string;
    fonts: Array<{
      family: string;
      weights: number[];
      styles: string[];
      fallbacks: string[];
    }>;
    colors: {
      primary?: string;
      secondary?: string;
      culturalPreferences: Record<string, string>;
    };
    images: {
      culturalAdaptations: boolean;
      restrictedContent: string[]; // types of content to avoid
      preferredStyles: string[];
    };
  };
  legal: {
    regulations: Array<{
      name: string;
      type: 'privacy' | 'accessibility' | 'content' | 'commerce' | 'data';
      requirements: string[];
      compliance: boolean;
    }>;
    disclaimers: Array<{
      type: string;
      required: boolean;
      text: string;
      placement: string;
    }>;
    restrictions: Array<{
      type: string;
      description: string;
      impact: string;
    }>;
  };
  market: {
    size: number; // potential market size
    penetration: number; // market penetration percentage
    competition: 'low' | 'medium' | 'high';
    opportunity: 'low' | 'medium' | 'high';
    seasonality: Array<{
      period: string;
      impact: 'negative' | 'neutral' | 'positive';
      description: string;
    }>;
    preferences: {
      communicationStyle: 'direct' | 'indirect' | 'mixed';
      colorMeanings: Record<string, string>;
      culturalNorms: string[];
      businessPractices: string[];
    };
  };
  technical: {
    encoding: string;
    collation: string;
    ime: boolean;
    fonts: string[];
    keyboardLayout?: string;
    inputMethods: string[];
  };
  quality: {
    translationCoverage: number; // percentage
    reviewCoverage: number; // percentage
    userSatisfaction: number; // 0-10
    errorRate: number; // percentage
    performance: {
      loadTime: number; // milliseconds
      memoryUsage: number; // MB
      cacheHitRate: number; // percentage
    };
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    maintainer: string;
    status: 'development' | 'beta' | 'production' | 'maintenance';
    tags: string[];
  };
}

export interface TranslationProject {
  id: string;
  name: string;
  description: string;
  type: 'website' | 'mobile_app' | 'software' | 'documentation' | 'marketing' | 'legal' | 'other';
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scope: {
    sourceLanguage: string;
    targetLanguages: string[];
    domains: string[]; // subject domains
    wordCount: {
      total: number;
      new: number;
      fuzzy: number;
      repeated: number;
      leveraged: number; // from translation memory
    };
    fileTypes: string[];
    deliverables: Array<{
      type: string;
      format: string;
      deadline: string;
      language?: string;
    }>;
  };
  timeline: {
    startDate: string;
    endDate: string;
    milestones: Array<{
      name: string;
      date: string;
      status: 'pending' | 'completed' | 'overdue';
      deliverables: string[];
    }>;
    phases: Array<{
      name: string;
      startDate: string;
      endDate: string;
      status: 'not_started' | 'in_progress' | 'completed';
      tasks: Array<{
        name: string;
        assignee: string;
        deadline: string;
        status: string;
      }>;
    }>;
  };
  team: {
    manager: {
      id: string;
      name: string;
      contact: string;
    };
    translators: Array<{
      id: string;
      name: string;
      languages: Array<{
        from: string;
        to: string;
        rate: number; // per word
        availability: number; // words per day
      }>;
      specializations: string[];
      rating: number; // 0-5
      assigned: {
        wordCount: number;
        deadline: string;
        languages: string[];
      };
    }>;
    reviewers: Array<{
      id: string;
      name: string;
      languages: string[];
      type: 'linguistic' | 'functional' | 'cultural' | 'technical';
      assigned: {
        sections: string[];
        deadline: string;
      };
    }>;
    external: Array<{
      vendor: string;
      contact: string;
      scope: string;
      cost: number;
      deadline: string;
    }>;
  };
  quality: {
    standards: Array<{
      type: 'linguistic' | 'functional' | 'cultural' | 'technical';
      criteria: string[];
      requirements: string[];
    }>;
    metrics: {
      accuracy: number; // 0-10
      fluency: number; // 0-10
      consistency: number; // 0-10
      cultural: number; // 0-10
      technical: number; // 0-10
      overall: number; // 0-10
    };
    reviews: Array<{
      type: string;
      reviewer: string;
      date: string;
      score: number;
      feedback: string;
      language?: string;
    }>;
  };
  workflow: {
    steps: Array<{
      name: string;
      type: 'translation' | 'review' | 'approval' | 'testing' | 'delivery';
      status: 'pending' | 'in_progress' | 'completed' | 'skipped';
      assignee?: string;
      deadline?: string;
      dependencies: string[];
      automated: boolean;
    }>;
    automations: Array<{
      trigger: string;
      action: string;
      conditions: Record<string, any>;
      enabled: boolean;
    }>;
    notifications: Array<{
      event: string;
      recipients: string[];
      template: string;
      enabled: boolean;
    }>;
  };
  budget: {
    total: number;
    currency: string;
    breakdown: {
      translation: number;
      review: number;
      management: number;
      tools: number;
      other: number;
    };
    actual: {
      spent: number;
      remaining: number;
      projected: number;
    };
  };
  assets: {
    source: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      wordCount: number;
      url: string;
      lastModified: string;
    }>;
    reference: Array<{
      id: string;
      name: string;
      type: 'glossary' | 'styleguide' | 'tm' | 'previous_work' | 'brand_guide';
      url: string;
      description: string;
    }>;
    deliverable: Array<{
      id: string;
      name: string;
      language: string;
      format: string;
      status: 'pending' | 'ready' | 'delivered';
      url?: string;
      deliveredAt?: string;
    }>;
  };
  metrics: {
    progress: {
      overall: number; // percentage
      byLanguage: Record<string, number>;
      byPhase: Record<string, number>;
    };
    productivity: {
      wordsPerDay: number;
      averageSpeed: number; // words per hour
      efficiency: number; // percentage
    };
    quality: {
      errorRate: number; // percentage
      revisionRate: number; // percentage
      approvalRate: number; // percentage
    };
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    client?: {
      name: string;
      contact: string;
      requirements: string[];
    };
    tags: string[];
    customFields: Record<string, any>;
  };
}

export interface CulturalAdaptation {
  id: string;
  name: string;
  description: string;
  region: string;
  language: string;
  category: 'visual' | 'textual' | 'functional' | 'legal' | 'commercial' | 'social';
  type: 'color' | 'imagery' | 'layout' | 'content' | 'feature' | 'behavior' | 'compliance';
  adaptations: Array<{
    element: string;
    original: any;
    adapted: any;
    reason: string;
    impact: 'low' | 'medium' | 'high';
    testRequired: boolean;
  }>;
  cultural: {
    values: Array<{
      dimension: string; // hofstede, trompenaars, etc.
      score: number;
      description: string;
      implications: string[];
    }>;
    preferences: {
      colors: Record<string, {
        meaning: string;
        emotional_response: string;
        appropriateness: 'avoid' | 'use_carefully' | 'preferred';
      }>;
      imagery: {
        preferred: string[];
        avoid: string[];
        considerations: string[];
      };
      communication: {
        style: 'direct' | 'indirect' | 'high_context' | 'low_context';
        formality: 'formal' | 'informal' | 'mixed';
        tone: string[];
      };
      interaction: {
        navigation: 'linear' | 'non_linear' | 'hierarchical';
        feedback: 'immediate' | 'delayed' | 'subtle';
        help: 'self_service' | 'guided' | 'personal';
      };
    };
    taboos: Array<{
      category: string;
      description: string;
      severity: 'minor' | 'moderate' | 'major' | 'critical';
      alternatives: string[];
    }>;
    holidays: Array<{
      name: string;
      date: string;
      type: 'national' | 'religious' | 'cultural' | 'commercial';
      impact: 'business_closed' | 'reduced_activity' | 'increased_activity';
      considerations: string[];
    }>;
  };
  implementation: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    effort: 'low' | 'medium' | 'high';
    timeline: string;
    dependencies: string[];
    risks: Array<{
      risk: string;
      probability: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
  };
  validation: {
    methods: Array<{
      type: 'user_testing' | 'expert_review' | 'survey' | 'analytics' | 'ab_test';
      description: string;
      participants?: number;
      duration?: string;
    }>;
    results: Array<{
      method: string;
      date: string;
      participants: number;
      findings: string[];
      recommendations: string[];
      approved: boolean;
    }>;
    metrics: {
      userSatisfaction: number; // 0-10
      culturalFit: number; // 0-10
      usability: number; // 0-10
      effectiveness: number; // 0-10
    };
  };
  maintenance: {
    reviewFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
    lastReview: string;
    nextReview: string;
    changeIndicators: Array<{
      indicator: string;
      threshold: number;
      action: string;
    }>;
    updateTriggers: Array<{
      event: string;
      automated: boolean;
      notification: string[];
    }>;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    status: 'draft' | 'review' | 'approved' | 'implemented' | 'deprecated';
    tags: string[];
    references: Array<{
      type: string;
      url: string;
      description: string;
    }>;
  };
}

export const localizationAPI = {
  /**
   * Get supported languages
   */
  getLanguages: async (
    filters?: {
      status?: Language['status'];
      region?: string;
      support?: keyof Language['support'];
    }
  ): Promise<Language[]> => {
    const { data } = await api.get('/localization/languages', { params: filters });
    return data;
  },

  /**
   * Add language support
   */
  addLanguage: async (
    languageData: Omit<Language, 'id' | 'statistics' | 'quality' | 'resources' | 'metadata'>
  ): Promise<Language> => {
    const { data } = await api.post('/localization/languages', languageData);
    return data;
  },

  /**
   * Update language configuration
   */
  updateLanguage: async (
    languageId: string,
    updates: Partial<Language>
  ): Promise<Language> => {
    const { data } = await api.put(`/localization/languages/${languageId}`, updates);
    return data;
  },

  /**
   * Create translation key
   */
  createTranslationKey: async (
    keyData: Omit<TranslationKey, 'id' | 'translations' | 'usage' | 'workflow' | 'validation' | 'metadata'>
  ): Promise<TranslationKey> => {
    const { data } = await api.post('/localization/keys', keyData);
    return data;
  },

  /**
   * Get translation keys
   */
  getTranslationKeys: async (
    filters?: {
      namespace?: string;
      category?: TranslationKey['category'];
      type?: TranslationKey['type'];
      status?: string;
      search?: string;
      untranslated?: string; // language code
    }
  ): Promise<TranslationKey[]> => {
    const { data } = await api.get('/localization/keys', { params: filters });
    return data;
  },

  /**
   * Update translation
   */
  updateTranslation: async (
    keyId: string,
    language: string,
    translation: {
      text: string;
      translator?: string;
      notes?: string;
    }
  ): Promise<TranslationKey> => {
    const { data } = await api.put(`/localization/keys/${keyId}/translations/${language}`, translation);
    return data;
  },

  /**
   * Review translation
   */
  reviewTranslation: async (
    keyId: string,
    language: string,
    review: {
      status: 'approved' | 'rejected' | 'needs_revision';
      notes?: string;
      suggestions?: string;
    }
  ): Promise<TranslationKey> => {
    const { data } = await api.post(`/localization/keys/${keyId}/translations/${language}/review`, review);
    return data;
  },

  /**
   * Translate with AI
   */
  translateWithAI: async (
    request: {
      keys?: string[];
      text?: string;
      sourceLanguage: string;
      targetLanguages: string[];
      context?: string;
      domain?: string;
      quality?: 'fast' | 'balanced' | 'high';
    }
  ): Promise<{
    translations: Array<{
      key?: string;
      sourceText: string;
      targetLanguage: string;
      translatedText: string;
      confidence: number; // 0-100
      alternatives?: Array<{
        text: string;
        confidence: number;
      }>;
    }>;
    metadata: {
      model: string;
      processingTime: number;
      cost: number;
      wordsProcessed: number;
    };
  }> => {
    const { data } = await api.post('/localization/translate/ai', request);
    return data;
  },

  /**
   * Get translation suggestions
   */
  getTranslationSuggestions: async (
    keyId: string,
    language: string,
    options?: {
      sources?: Array<'tm' | 'glossary' | 'ai' | 'similar'>;
      maxSuggestions?: number;
      minConfidence?: number;
    }
  ): Promise<{
    suggestions: Array<{
      text: string;
      source: 'translation_memory' | 'glossary' | 'ai' | 'similar_key';
      confidence: number; // 0-100
      metadata?: {
        originalKey?: string;
        similarity?: number;
        lastUsed?: string;
        translator?: string;
      };
    }>;
    context: {
      namespace: string;
      category: string;
      relatedKeys: string[];
    };
  }> => {
    const { data } = await api.get(`/localization/keys/${keyId}/suggestions/${language}`, {
      params: options,
    });
    return data;
  },

  /**
   * Export translations
   */
  exportTranslations: async (
    exportConfig: {
      languages?: string[];
      namespaces?: string[];
      format: 'json' | 'csv' | 'xlsx' | 'po' | 'xliff' | 'properties';
      filters?: {
        status?: string[];
        categories?: string[];
      };
      options?: {
        includeMetadata?: boolean;
        flattenKeys?: boolean;
        emptyValue?: string;
        fallback?: boolean;
      };
    }
  ): Promise<{
    downloadUrl: string;
    expiresAt: string;
    format: string;
    languages: string[];
    keyCount: number;
    size: number;
  }> => {
    const { data } = await api.post('/localization/export', exportConfig);
    return data;
  },

  /**
   * Import translations
   */
  importTranslations: async (
    file: File,
    importConfig: {
      format: 'json' | 'csv' | 'xlsx' | 'po' | 'xliff' | 'properties';
      language?: string;
      namespace?: string;
      options: {
        overwrite: boolean;
        createKeys: boolean;
        skipReviewed: boolean;
        validateFormat: boolean;
        notifyTranslators: boolean;
      };
    }
  ): Promise<{
    jobId: string;
    status: 'processing';
    estimatedCompletion: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('config', JSON.stringify(importConfig));

    const { data } = await api.post('/localization/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Get import status
   */
  getImportStatus: async (
    jobId: string
  ): Promise<{
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number; // percentage
    results?: {
      imported: number;
      updated: number;
      skipped: number;
      errors: Array<{
        line?: number;
        key?: string;
        error: string;
      }>;
    };
    completedAt?: string;
  }> => {
    const { data } = await api.get(`/localization/import/${jobId}`);
    return data;
  },

  /**
   * Get locales
   */
  getLocales: async (
    filters?: {
      enabled?: boolean;
      region?: string;
      language?: string;
    }
  ): Promise<Locale[]> => {
    const { data } = await api.get('/localization/locales', { params: filters });
    return data;
  },

  /**
   * Create locale
   */
  createLocale: async (
    localeData: Omit<Locale, 'id' | 'quality' | 'metadata'>
  ): Promise<Locale> => {
    const { data } = await api.post('/localization/locales', localeData);
    return data;
  },

  /**
   * Update locale
   */
  updateLocale: async (
    localeId: string,
    updates: Partial<Locale>
  ): Promise<Locale> => {
    const { data } = await api.put(`/localization/locales/${localeId}`, updates);
    return data;
  },

  /**
   * Format content for locale
   */
  formatContent: async (
    locale: string,
    content: {
      numbers?: Array<{
        value: number;
        type: 'decimal' | 'currency' | 'percent';
        currency?: string;
      }>;
      dates?: Array<{
        value: string;
        format: 'short' | 'medium' | 'long' | 'time' | 'datetime';
      }>;
      addresses?: Array<{
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      }>;
      names?: Array<{
        given?: string;
        family?: string;
        title?: string;
      }>;
    }
  ): Promise<{
    numbers?: string[];
    dates?: string[];
    addresses?: string[];
    names?: string[];
    metadata: {
      locale: string;
      timezone: string;
      currency: string;
    };
  }> => {
    const { data } = await api.post(`/localization/locales/${locale}/format`, content);
    return data;
  },

  /**
   * Create translation project
   */
  createProject: async (
    projectData: Omit<TranslationProject, 'id' | 'metrics' | 'metadata'>
  ): Promise<TranslationProject> => {
    const { data } = await api.post('/localization/projects', projectData);
    return data;
  },

  /**
   * Get translation projects
   */
  getProjects: async (
    filters?: {
      status?: TranslationProject['status'];
      type?: TranslationProject['type'];
      language?: string;
      manager?: string;
    }
  ): Promise<TranslationProject[]> => {
    const { data } = await api.get('/localization/projects', { params: filters });
    return data;
  },

  /**
   * Get project details
   */
  getProject: async (projectId: string): Promise<TranslationProject> => {
    const { data } = await api.get(`/localization/projects/${projectId}`);
    return data;
  },

  /**
   * Update project status
   */
  updateProjectStatus: async (
    projectId: string,
    status: TranslationProject['status'],
    notes?: string
  ): Promise<TranslationProject> => {
    const { data } = await api.put(`/localization/projects/${projectId}/status`, { status, notes });
    return data;
  },

  /**
   * Assign translator
   */
  assignTranslator: async (
    projectId: string,
    assignment: {
      translatorId: string;
      languages: Array<{
        from: string;
        to: string;
      }>;
      wordCount: number;
      deadline: string;
      rate?: number;
    }
  ): Promise<TranslationProject> => {
    const { data } = await api.post(`/localization/projects/${projectId}/assign`, assignment);
    return data;
  },

  /**
   * Get cultural adaptations
   */
  getCulturalAdaptations: async (
    filters?: {
      region?: string;
      language?: string;
      category?: CulturalAdaptation['category'];
      type?: CulturalAdaptation['type'];
      status?: CulturalAdaptation['metadata']['status'];
    }
  ): Promise<CulturalAdaptation[]> => {
    const { data } = await api.get('/localization/cultural-adaptations', { params: filters });
    return data;
  },

  /**
   * Create cultural adaptation
   */
  createCulturalAdaptation: async (
    adaptationData: Omit<CulturalAdaptation, 'id' | 'validation' | 'maintenance' | 'metadata'>
  ): Promise<CulturalAdaptation> => {
    const { data } = await api.post('/localization/cultural-adaptations', adaptationData);
    return data;
  },

  /**
   * Validate cultural adaptation
   */
  validateCulturalAdaptation: async (
    adaptationId: string,
    validation: {
      method: string;
      participants?: number;
      duration?: string;
      metrics?: string[];
    }
  ): Promise<{
    validationId: string;
    status: 'started';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post(`/localization/cultural-adaptations/${adaptationId}/validate`, validation);
    return data;
  },

  /**
   * Get localization analytics
   */
  getAnalytics: async (
    timeframe: { start: string; end: string },
    dimensions?: string[]
  ): Promise<{
    summary: {
      languages: number;
      translationKeys: number;
      translatedKeys: number;
      reviewedKeys: number;
      projects: number;
      completedProjects: number;
    };
    coverage: Record<string, {
      translated: number; // percentage
      reviewed: number; // percentage
      approved: number; // percentage
      quality: number; // 0-10
    }>;
    productivity: {
      wordsTranslated: number;
      averageSpeed: number; // words per day
      qualityScore: number; // 0-10
      efficiency: number; // percentage
    };
    quality: Record<string, {
      accuracy: number; // 0-10
      fluency: number; // 0-10
      consistency: number; // 0-10
      cultural: number; // 0-10
    }>;
    usage: Record<string, {
      sessions: number;
      users: number;
      pageViews: number;
      engagement: number; // average session duration
    }>;
    trends: Array<{
      date: string;
      metrics: Record<string, number>;
    }>;
    performance: Record<string, {
      loadTime: number; // milliseconds
      cacheHitRate: number; // percentage
      errorRate: number; // percentage
    }>;
  }> => {
    const { data } = await api.get('/localization/analytics', {
      params: { ...timeframe, dimensions },
    });
    return data;
  },

  /**
   * Get translation memory suggestions
   */
  getTranslationMemory: async (
    query: {
      text: string;
      sourceLanguage: string;
      targetLanguage: string;
      domain?: string;
      minSimilarity?: number;
      maxResults?: number;
    }
  ): Promise<{
    matches: Array<{
      sourceText: string;
      targetText: string;
      similarity: number; // 0-100
      domain?: string;
      lastUsed: string;
      frequency: number;
      context?: {
        key?: string;
        namespace?: string;
        translator?: string;
      };
    }>;
    metadata: {
      totalMatches: number;
      searchTime: number; // milliseconds
    };
  }> => {
    const { data } = await api.post('/localization/translation-memory/search', query);
    return data;
  },

  /**
   * Update translation memory
   */
  updateTranslationMemory: async (
    entry: {
      sourceText: string;
      targetText: string;
      sourceLanguage: string;
      targetLanguage: string;
      domain?: string;
      context?: Record<string, any>;
      quality?: number; // 0-10
    }
  ): Promise<{
    entryId: string;
    created: boolean;
    updated: boolean;
  }> => {
    const { data } = await api.post('/localization/translation-memory', entry);
    return data;
  },

  /**
   * Get glossary terms
   */
  getGlossary: async (
    filters?: {
      domain?: string;
      language?: string;
      search?: string;
      category?: string;
    }
  ): Promise<Array<{
    id: string;
    term: string;
    language: string;
    domain: string;
    category?: string;
    definition: string;
    translations: Record<string, {
      term: string;
      definition?: string;
      notes?: string;
      approved: boolean;
    }>;
    metadata: {
      createdAt: string;
      updatedAt: string;
      usage: number;
      frequency: 'rare' | 'common' | 'frequent';
    };
  }>> => {
    const { data } = await api.get('/localization/glossary', { params: filters });
    return data;
  },

  /**
   * Add glossary term
   */
  addGlossaryTerm: async (
    term: {
      term: string;
      language: string;
      domain: string;
      category?: string;
      definition: string;
      translations?: Record<string, {
        term: string;
        definition?: string;
        notes?: string;
      }>;
    }
  ): Promise<{
    termId: string;
    created: string;
  }> => {
    const { data } = await api.post('/localization/glossary', term);
    return data;
  },

  /**
   * Validate translations
   */
  validateTranslations: async (
    validation: {
      language?: string;
      keys?: string[];
      rules?: string[];
      autoFix?: boolean;
    }
  ): Promise<{
    validationId: string;
    status: 'started';
    estimatedCompletion?: string;
    rules: string[];
  }> => {
    const { data } = await api.post('/localization/validate', validation);
    return data;
  },

  /**
   * Get validation results
   */
  getValidationResults: async (
    validationId: string
  ): Promise<{
    validationId: string;
    status: 'running' | 'completed' | 'failed';
    progress: number; // percentage
    results?: {
      passed: number;
      warnings: number;
      errors: number;
      issues: Array<{
        key: string;
        language: string;
        rule: string;
        severity: 'warning' | 'error';
        message: string;
        suggestion?: string;
        fixable: boolean;
      }>;
    };
    completedAt?: string;
  }> => {
    const { data } = await api.get(`/localization/validate/${validationId}`);
    return data;
  },

  /**
   * Generate localization report
   */
  generateReport: async (
    reportConfig: {
      type: 'coverage' | 'quality' | 'productivity' | 'usage' | 'comprehensive';
      timeframe: { start: string; end: string };
      languages?: string[];
      projects?: string[];
      format: 'pdf' | 'excel' | 'csv';
    }
  ): Promise<{
    reportId: string;
    status: 'generating';
    estimatedCompletion: string;
    downloadUrl?: string;
  }> => {
    const { data } = await api.post('/localization/reports', reportConfig);
    return data;
  },

  /**
   * Sync with external CAT tool
   */
  syncCATTool: async (
    sync: {
      tool: 'trados' | 'memoq' | 'phrase' | 'lokalise' | 'crowdin' | 'smartling';
      projectId: string;
      direction: 'import' | 'export' | 'bidirectional';
      configuration: Record<string, any>;
      schedule?: {
        frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
        time?: string;
      };
    }
  ): Promise<{
    syncId: string;
    status: 'started';
    estimatedCompletion?: string;
  }> => {
    const { data } = await api.post('/localization/cat-tools/sync', sync);
    return data;
  },
};

export default localizationAPI;