/**
 * Social Analytics API Services
 * Social media metrics, insights, and performance tracking
 */
import { api } from './client';

export interface SocialMetric {
  id: string;
  name: string;
  description: string;
  type: 'engagement' | 'reach' | 'impression' | 'conversion' | 'sentiment' | 'growth' | 'revenue' | 'custom';
  category: 'audience' | 'content' | 'platform' | 'campaign' | 'competitor' | 'trend' | 'business';
  platforms: string[];
  calculation: {
    formula: string;
    dataPoints: Array<{
      name: string;
      source: string;
      transformation?: string;
    }>;
    aggregation: 'sum' | 'average' | 'count' | 'rate' | 'percentage' | 'ratio' | 'custom';
    period: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  };
  thresholds: Array<{
    level: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
    value: number;
    color: string;
    action?: string;
  }>;
  benchmarks: {
    industry: {
      value: number;
      source: string;
      date: string;
    };
    internal: {
      baseline: number;
      target: number;
      historical: Array<{
        period: string;
        value: number;
      }>;
    };
    competitors: Array<{
      name: string;
      value: number;
      confidence: number;
    }>;
  };
  visualization: {
    chartType: 'line' | 'bar' | 'pie' | 'gauge' | 'number' | 'trend' | 'heatmap' | 'scatter';
    colorScheme: string;
    displayOptions: {
      showTrend: boolean;
      showBenchmark: boolean;
      showTarget: boolean;
      decimals: number;
      unit: string;
      prefix?: string;
      suffix?: string;
    };
  };
  alerts: Array<{
    condition: 'above' | 'below' | 'change' | 'anomaly';
    threshold: number;
    severity: 'info' | 'warning' | 'critical';
    recipients: string[];
    cooldown: number; // minutes
  }>;
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    favorite: boolean;
  };
}

export interface SocialDashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'campaign' | 'platform' | 'competitor' | 'custom';
  audience: 'public' | 'team' | 'management' | 'client' | 'private';
  layout: {
    columns: number;
    responsive: boolean;
    theme: string;
    header: {
      visible: boolean;
      title: string;
      subtitle?: string;
      logo?: string;
    };
    footer: {
      visible: boolean;
      content?: string;
    };
  };
  widgets: Array<{
    id: string;
    type: 'metric' | 'chart' | 'table' | 'text' | 'image' | 'video' | 'map' | 'feed' | 'iframe';
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    configuration: {
      metricId?: string;
      chartConfig?: {
        type: string;
        data: string;
        options: Record<string, any>;
      };
      tableConfig?: {
        columns: Array<{
          field: string;
          title: string;
          type: string;
          format?: string;
        }>;
        pagination: boolean;
        sorting: boolean;
        filtering: boolean;
      };
      textContent?: {
        content: string;
        markdown: boolean;
        variables: string[];
      };
      feedConfig?: {
        source: string;
        filters: Record<string, any>;
        limit: number;
        refreshInterval: number;
      };
    };
    styling: {
      backgroundColor?: string;
      borderColor?: string;
      textColor?: string;
      fontSize?: string;
      padding?: string;
      borderRadius?: string;
    };
    interactivity: {
      clickable: boolean;
      drillDown?: {
        enabled: boolean;
        target: string;
        parameters: Record<string, string>;
      };
      filters?: Array<{
        field: string;
        type: string;
        options?: string[];
      }>;
    };
    data: {
      source: string;
      refreshInterval: number; // seconds
      cacheTimeout: number; // seconds
      lastRefresh?: string;
    };
  }>;
  filters: {
    global: Array<{
      id: string;
      name: string;
      type: 'date_range' | 'platform' | 'campaign' | 'content_type' | 'audience' | 'custom';
      defaultValue?: any;
      options?: string[];
      required: boolean;
    }>;
    applied: Record<string, any>;
  };
  sharing: {
    public: boolean;
    publicUrl?: string;
    password?: string;
    expiresAt?: string;
    embeddable: boolean;
    embedCode?: string;
    downloadable: boolean;
    allowedUsers: string[];
  };
  automation: {
    autoRefresh: boolean;
    refreshInterval: number; // minutes
    scheduledReports: Array<{
      schedule: string;
      format: 'pdf' | 'excel' | 'image';
      recipients: string[];
      enabled: boolean;
    }>;
  };
  performance: {
    loadTime: number;
    dataSize: number;
    lastAccessed: string;
    viewCount: number;
    uniqueViewers: number;
  };
  metadata: {
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    tags: string[];
    category: string;
  };
}

export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'audit' | 'competitive' | 'roi' | 'content' | 'audience' | 'custom';
  scope: {
    platforms: string[];
    accounts: string[];
    campaigns?: string[];
    dateRange: {
      start: string;
      end: string;
      timezone: string;
    };
    filters?: Record<string, any>;
  };
  structure: {
    sections: Array<{
      id: string;
      title: string;
      type: 'summary' | 'metrics' | 'charts' | 'tables' | 'insights' | 'recommendations' | 'text';
      content: {
        metrics?: string[];
        charts?: Array<{
          type: string;
          data: string;
          title: string;
        }>;
        tables?: Array<{
          title: string;
          columns: string[];
          data: string;
        }>;
        text?: string;
        insights?: {
          automated: boolean;
          types: string[];
        };
      };
      styling?: {
        layout: string;
        colors: string[];
        fonts: Record<string, string>;
      };
    }>;
    appendix?: {
      methodology: boolean;
      glossary: boolean;
      rawData: boolean;
    };
  };
  generation: {
    automated: boolean;
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
      time: string;
      timezone: string;
      recipients: string[];
    };
    template?: string;
    customizations: Record<string, any>;
  };
  data: {
    executiveSummary: {
      keyFindings: string[];
      recommendations: string[];
      highlights: Array<{
        metric: string;
        value: number;
        change: number;
        significance: string;
      }>;
    };
    metrics: Record<string, {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
      benchmark?: number;
      target?: number;
    }>;
    insights: Array<{
      type: 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'achievement';
      priority: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      impact: string;
      confidence: number;
      recommendations: string[];
    }>;
    comparisons: {
      previousPeriod: Record<string, number>;
      yearOverYear: Record<string, number>;
      industry: Record<string, number>;
      competitors: Record<string, Record<string, number>>;
    };
  };
  distribution: {
    format: 'pdf' | 'excel' | 'powerpoint' | 'html' | 'json';
    recipients: Array<{
      email: string;
      role: string;
      customizations?: Record<string, any>;
    }>;
    delivery: {
      method: 'email' | 'download' | 'api' | 'storage';
      location?: string;
      retention: number; // days
    };
  };
  metadata: {
    generatedAt?: string;
    generatedBy?: string;
    version: number;
    size?: number;
    downloadUrl?: string;
    status: 'draft' | 'generating' | 'completed' | 'failed' | 'expired';
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

export interface CompetitorAnalysis {
  id: string;
  name: string;
  description: string;
  competitors: Array<{
    id: string;
    name: string;
    industry: string;
    size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    platforms: Array<{
      platform: string;
      handle: string;
      verified: boolean;
      active: boolean;
      lastPost?: string;
    }>;
    metadata: {
      website?: string;
      description?: string;
      founded?: string;
      headquarters?: string;
      employees?: number;
    };
  }>;
  tracking: {
    platforms: string[];
    metrics: Array<{
      name: string;
      type: string;
      importance: 'low' | 'medium' | 'high';
      frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
    }>;
    content: {
      types: string[];
      themes: string[];
      keywords: string[];
      hashtags: string[];
    };
    alerts: Array<{
      type: 'new_post' | 'viral_content' | 'mention' | 'milestone' | 'campaign_launch';
      threshold?: number;
      recipients: string[];
    }>;
  };
  analysis: {
    period: {
      start: string;
      end: string;
      timezone: string;
    };
    metrics: Record<string, {
      own: number;
      competitors: Record<string, number>;
      industry: number;
      ranking: number;
      gap: number;
    }>;
    content: {
      postFrequency: Record<string, number>;
      topPerforming: Array<{
        competitor: string;
        platform: string;
        content: {
          type: string;
          text: string;
          engagement: number;
          reach: number;
        };
      }>;
      themes: Record<string, {
        usage: Record<string, number>;
        performance: Record<string, number>;
      }>;
      hashtags: Record<string, {
        usage: Record<string, number>;
        effectiveness: Record<string, number>;
      }>;
    };
    audience: {
      overlap: Record<string, number>;
      demographics: Record<string, Record<string, number>>;
      interests: Record<string, string[]>;
      engagement: Record<string, {
        rate: number;
        quality: number;
        timing: string[];
      }>;
    };
    positioning: {
      messaging: Record<string, string[]>;
      tonality: Record<string, {
        formal: number;
        casual: number;
        humorous: number;
        professional: number;
      }>;
      brandAttributes: Record<string, string[]>;
      differentiators: string[];
    };
  };
  insights: Array<{
    category: 'content' | 'audience' | 'strategy' | 'performance' | 'opportunity';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    evidence: string[];
    implications: string[];
    recommendations: Array<{
      action: string;
        impact: 'low' | 'medium' | 'high';
        effort: 'low' | 'medium' | 'high';
        timeline: string;
      }>;
    }>;
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    metadata: {
      createdBy: string;
      createdAt: string;
      updatedAt: string;
      lastAnalysis: string;
      confidence: number;
      tags: string[];
    };
  }

  export interface TrendAnalysis {
    id: string;
    name: string;
    description: string;
    type: 'hashtag' | 'topic' | 'content_format' | 'platform_feature' | 'audience_behavior' | 'industry' | 'seasonal';
    scope: {
      geographic: string[];
      demographic: Record<string, string[]>;
      platforms: string[];
      timeframe: {
        start: string;
        end: string;
        granularity: 'hour' | 'day' | 'week' | 'month';
      };
    };
    detection: {
      methods: Array<{
        name: string;
        type: 'volume' | 'sentiment' | 'engagement' | 'velocity' | 'reach' | 'ai_detection';
        weight: number;
        threshold: number;
        sensitivity: 'low' | 'medium' | 'high';
      }>;
      sources: Array<{
        platform: string;
        dataType: string;
        coverage: number; // percentage
        lag: number; // minutes
      }>;
      filters: Array<{
        type: 'language' | 'location' | 'account_type' | 'content_type' | 'keywords';
        values: string[];
        exclude: boolean;
      }>;
    };
    trends: Array<{
      id: string;
      keyword: string;
      category: string;
      status: 'emerging' | 'rising' | 'peak' | 'declining' | 'stable';
      metrics: {
        volume: number;
        velocity: number; // rate of change
        reach: number;
        engagement: number;
        sentiment: number; // -1 to 1
        virality: number; // 0 to 1
      };
      timeline: Array<{
        timestamp: string;
        volume: number;
        sentiment: number;
        topPosts: string[];
      }>;
      demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
        interests: Record<string, number>;
      };
      related: {
        hashtags: Array<{
          tag: string;
          correlation: number;
          coOccurrence: number;
        }>;
        topics: Array<{
          topic: string;
          relevance: number;
          overlap: number;
        }>;
        influencers: Array<{
          handle: string;
          influence: number;
          contribution: number;
        }>;
      };
      predictions: {
        peakTime?: string;
        duration: number; // hours
        maxVolume: number;
        confidence: number; // 0 to 1
        factors: string[];
      };
      opportunities: Array<{
        type: 'content' | 'engagement' | 'advertising' | 'partnership';
        description: string;
        potential: 'low' | 'medium' | 'high';
        timeWindow: string;
        requirements: string[];
      }>;
    }>;
    insights: {
      summary: string;
      keyFindings: string[];
      implications: string[];
      recommendations: Array<{
        action: string;
        priority: 'low' | 'medium' | 'high';
        effort: 'low' | 'medium' | 'high';
        timeline: string;
        expectedImpact: string;
      }>;
    };
    automation: {
      monitoring: {
        enabled: boolean;
        frequency: number; // minutes
        alertThresholds: Record<string, number>;
      };
      actions: Array<{
        trigger: string;
        condition: string;
        action: 'alert' | 'create_content' | 'adjust_campaign' | 'notify_team';
        configuration: Record<string, any>;
      }>;
    };
    metadata: {
      createdBy: string;
      createdAt: string;
      updatedAt: string;
      lastAnalysis: string;
      dataQuality: number; // 0 to 1
      coverage: number; // percentage
      tags: string[];
    };
  }

  export interface AudienceInsight {
    id: string;
    name: string;
    description: string;
    type: 'demographic' | 'psychographic' | 'behavioral' | 'geographic' | 'interest' | 'journey' | 'segment';
    scope: {
      platforms: string[];
      accounts: string[];
      timeframe: {
        start: string;
        end: string;
      };
      filters: Record<string, any>;
    };
    segmentation: {
      method: 'automatic' | 'manual' | 'hybrid';
      criteria: Array<{
        dimension: string;
        type: 'demographic' | 'behavioral' | 'engagement' | 'interest';
        weight: number;
      }>;
      segments: Array<{
        id: string;
        name: string;
        description: string;
        size: number;
        percentage: number;
        characteristics: {
          demographics: Record<string, any>;
          interests: string[];
          behaviors: string[];
          preferences: Record<string, any>;
        };
        engagement: {
          rate: number;
          frequency: number;
          quality: number;
          peakTimes: string[];
        };
        content: {
          preferences: Record<string, number>;
          topPerforming: string[];
          avoided: string[];
        };
        journey: {
          stage: string;
          touchpoints: string[];
          conversion: number;
          lifetime: number; // days
        };
        growth: {
          rate: number; // percentage
          source: Record<string, number>;
          retention: number;
        };
        value: {
          engagement: number;
          conversion: number;
          revenue: number;
          clv: number; // customer lifetime value
        };
      }>;
    };
    analysis: {
      demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
        education: Record<string, number>;
        income: Record<string, number>;
        occupation: Record<string, number>;
      };
      psychographics: {
        interests: Record<string, number>;
        values: Record<string, number>;
        lifestyle: Record<string, number>;
        personality: Record<string, number>;
      };
      behavior: {
        online: {
          activeHours: Record<string, number>;
          deviceUsage: Record<string, number>;
          platformUsage: Record<string, number>;
          sessionDuration: number;
        };
        engagement: {
          contentTypes: Record<string, number>;
          interactionTypes: Record<string, number>;
          frequency: Record<string, number>;
          timing: Record<string, number>;
        };
        purchasing: {
          frequency: Record<string, number>;
          categories: Record<string, number>;
          priceRange: Record<string, number>;
          influences: Record<string, number>;
        };
      };
      journey: {
        stages: Array<{
          stage: string;
          percentage: number;
          averageTime: number;
          dropoffRate: number;
          topContent: string[];
        }>;
        touchpoints: Array<{
          touchpoint: string;
          frequency: number;
          effectiveness: number;
          conversion: number;
        }>;
        paths: Array<{
          path: string[];
          frequency: number;
          conversion: number;
          revenue: number;
        }>;
      };
    };
    insights: Array<{
      category: 'demographic' | 'behavioral' | 'preference' | 'opportunity' | 'risk';
      priority: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      evidence: Record<string, any>;
      implications: string[];
      recommendations: Array<{
        action: string;
        target: string;
        expected: string;
        effort: 'low' | 'medium' | 'high';
      }>;
    }>;
    personalization: {
      enabled: boolean;
      strategies: Array<{
        segment: string;
        approach: string;
        content: Record<string, any>;
        timing: Record<string, any>;
        channels: string[];
      }>;
    };
    predictions: {
      growth: Array<{
        segment: string;
        projection: number;
        confidence: number;
        factors: string[];
      }>;
      churn: Array<{
        segment: string;
        risk: number;
        indicators: string[];
        prevention: string[];
      }>;
      lifetime: Array<{
        segment: string;
        value: number;
        duration: number;
        confidence: number;
      }>;
    };
    metadata: {
      createdBy: string;
      createdAt: string;
      updatedAt: string;
      lastAnalysis: string;
      dataQuality: number;
      sampleSize: number;
      confidence: number;
      tags: string[];
    };
  }

  export interface ROIAnalysis {
    id: string;
    name: string;
    description: string;
    scope: {
      campaigns?: string[];
      platforms: string[];
      timeframe: {
        start: string;
        end: string;
      };
      attribution: {
        model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'data_driven';
        window: number; // days
        channels: string[];
      };
    };
    investment: {
      total: number;
      breakdown: {
        advertising: number;
        content: number;
        tools: number;
        personnel: number;
        influencer: number;
        other: number;
      };
      allocation: Record<string, number>; // by platform/campaign
      currency: string;
    };
    revenue: {
      total: number;
      direct: number;
      attributed: number;
      assisted: number;
      breakdown: {
        sales: number;
        leads: number;
        engagement: number;
        brand: number;
      };
      attribution: Array<{
        channel: string;
        touchpoint: string;
        contribution: number;
        percentage: number;
      }>;
    };
    metrics: {
      roi: number; // return on investment
      roas: number; // return on ad spend
      cpa: number; // cost per acquisition
      cpc: number; // cost per click
      cpm: number; // cost per mille
      ltv: number; // lifetime value
      payback: number; // months
      margin: number; // percentage
    };
    conversion: {
      funnel: Array<{
        stage: string;
        visitors: number;
        conversions: number;
        rate: number;
        value: number;
      }>;
      paths: Array<{
        path: string[];
        frequency: number;
        conversion: number;
        value: number;
        time: number; // hours
      }>;
      touchpoints: Array<{
        touchpoint: string;
        impressions: number;
        clicks: number;
        conversions: number;
        assistance: number;
        value: number;
      }>;
    };
    performance: {
      byPlatform: Record<string, {
        investment: number;
        revenue: number;
        roi: number;
        conversions: number;
        efficiency: number;
      }>;
      byCampaign: Record<string, {
        investment: number;
        revenue: number;
        roi: number;
        performance: Record<string, number>;
      }>;
      byContent: Array<{
        contentId: string;
        type: string;
        investment: number;
        revenue: number;
        roi: number;
        engagement: number;
      }>;
    };
    optimization: {
      recommendations: Array<{
        category: 'budget' | 'targeting' | 'content' | 'timing' | 'platform';
        priority: 'low' | 'medium' | 'high';
        description: string;
        expectedImpact: number; // percentage
        effort: 'low' | 'medium' | 'high';
        implementation: string[];
      }>;
      allocation: {
        current: Record<string, number>;
        recommended: Record<string, number>;
        reasoning: string[];
      };
      efficiency: Array<{
        metric: string;
        current: number;
        target: number;
        actions: string[];
      }>;
    };
    forecasting: {
      projections: Array<{
        period: string;
        investment: number;
        revenue: number;
        roi: number;
        confidence: number;
        assumptions: string[];
      }>;
      scenarios: Array<{
        name: string;
        description: string;
        changes: Record<string, number>;
        impact: Record<string, number>;
        probability: number;
      }>;
    };
    metadata: {
      createdBy: string;
      createdAt: string;
      updatedAt: string;
      methodology: string;
      assumptions: string[];
      limitations: string[];
      confidence: number;
      tags: string[];
    };
  }

  export const socialAnalyticsAPI = {
    /**
     * Create custom metric
     */
    createMetric: async (
      metricData: Omit<SocialMetric, 'id' | 'metadata'>
    ): Promise<SocialMetric> => {
      const { data } = await api.post('/social/analytics/metrics', metricData);
      return data;
    },

    /**
     * Get metrics
     */
    getMetrics: async (
      filters?: {
        type?: SocialMetric['type'];
        category?: SocialMetric['category'];
        platform?: string;
        tags?: string[];
      }
    ): Promise<SocialMetric[]> => {
      const { data } = await api.get('/social/analytics/metrics', { params: filters });
      return data;
    },

    /**
     * Calculate metric value
     */
    calculateMetric: async (
      metricId: string,
      period: { start: string; end: string },
      filters?: Record<string, any>
    ): Promise<{
      value: number;
      trend: number;
      breakdown: Record<string, number>;
      comparison: {
        previousPeriod: number;
        benchmark: number;
        target: number;
      };
      quality: {
        dataPoints: number;
        confidence: number;
        completeness: number;
      };
    }> => {
      const { data } = await api.post(`/social/analytics/metrics/${metricId}/calculate`, {
        period,
        filters,
      });
      return data;
    },

    /**
     * Create dashboard
     */
    createDashboard: async (
      dashboardData: Omit<SocialDashboard, 'id' | 'performance' | 'metadata'>
    ): Promise<SocialDashboard> => {
      const { data } = await api.post('/social/analytics/dashboards', dashboardData);
      return data;
    },

    /**
     * Get dashboards
     */
    getDashboards: async (
      filters?: {
        type?: SocialDashboard['type'];
        audience?: SocialDashboard['audience'];
        createdBy?: string;
      }
    ): Promise<SocialDashboard[]> => {
      const { data } = await api.get('/social/analytics/dashboards', { params: filters });
      return data;
    },

    /**
     * Get dashboard data
     */
    getDashboardData: async (
      dashboardId: string,
      filters?: Record<string, any>
    ): Promise<{
      dashboard: SocialDashboard;
      data: Record<string, any>; // widget data
      lastUpdate: string;
      performance: {
        loadTime: number;
        dataFreshness: number;
      };
    }> => {
      const { data } = await api.get(`/social/analytics/dashboards/${dashboardId}/data`, {
        params: filters,
      });
      return data;
    },

    /**
     * Generate report
     */
    generateReport: async (
      reportData: Omit<AnalyticsReport, 'id' | 'data' | 'metadata'>
    ): Promise<{
      reportId: string;
      jobId: string;
      status: 'queued' | 'generating' | 'completed' | 'failed';
      estimatedCompletion?: string;
    }> => {
      const { data } = await api.post('/social/analytics/reports', reportData);
      return data;
    },

    /**
     * Get reports
     */
    getReports: async (
      filters?: {
        type?: AnalyticsReport['type'];
        status?: string;
        automated?: boolean;
      }
    ): Promise<AnalyticsReport[]> => {
      const { data } = await api.get('/social/analytics/reports', { params: filters });
      return data;
    },

    /**
     * Download report
     */
    downloadReport: async (
      reportId: string,
      format?: 'pdf' | 'excel' | 'powerpoint' | 'json'
    ): Promise<Blob> => {
      const { data } = await api.get(`/social/analytics/reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob',
      });
      return data;
    },

    /**
     * Create competitor analysis
     */
    createCompetitorAnalysis: async (
      analysisData: Omit<CompetitorAnalysis, 'id' | 'analysis' | 'insights' | 'metadata'>
    ): Promise<CompetitorAnalysis> => {
      const { data } = await api.post('/social/analytics/competitors', analysisData);
      return data;
    },

    /**
     * Get competitor analyses
     */
    getCompetitorAnalyses: async (): Promise<CompetitorAnalysis[]> => {
      const { data } = await api.get('/social/analytics/competitors');
      return data;
    },

    /**
     * Run competitor analysis
     */
    runCompetitorAnalysis: async (
      analysisId: string,
      options?: {
        includeContent?: boolean;
        includeAudience?: boolean;
        depth?: 'basic' | 'standard' | 'comprehensive';
      }
    ): Promise<{
      jobId: string;
      status: 'queued' | 'running' | 'completed' | 'failed';
      estimatedCompletion?: string;
    }> => {
      const { data } = await api.post(`/social/analytics/competitors/${analysisId}/run`, options);
      return data;
    },

    /**
     * Create trend analysis
     */
    createTrendAnalysis: async (
      analysisData: Omit<TrendAnalysis, 'id' | 'trends' | 'insights' | 'metadata'>
    ): Promise<TrendAnalysis> => {
      const { data } = await api.post('/social/analytics/trends', analysisData);
      return data;
    },

    /**
     * Get trend analyses
     */
    getTrendAnalyses: async (
      filters?: {
        type?: TrendAnalysis['type'];
        platform?: string;
        active?: boolean;
      }
    ): Promise<TrendAnalysis[]> => {
      const { data } = await api.get('/social/analytics/trends', { params: filters });
      return data;
    },

    /**
     * Get current trends
     */
    getCurrentTrends: async (
      filters?: {
        platforms?: string[];
        categories?: string[];
        location?: string;
        timeframe?: string;
        limit?: number;
      }
    ): Promise<Array<{
      keyword: string;
      category: string;
      volume: number;
      velocity: number;
      status: string;
      platforms: string[];
      demographics: Record<string, number>;
      sentiment: number;
      opportunities: string[];
    }>> => {
      const { data } = await api.get('/social/analytics/trends/current', { params: filters });
      return data;
    },

    /**
     * Create audience insight
     */
    createAudienceInsight: async (
      insightData: Omit<AudienceInsight, 'id' | 'analysis' | 'insights' | 'metadata'>
    ): Promise<AudienceInsight> => {
      const { data } = await api.post('/social/analytics/audience', insightData);
      return data;
    },

    /**
     * Get audience insights
     */
    getAudienceInsights: async (
      filters?: {
        type?: AudienceInsight['type'];
        platform?: string;
        segment?: string;
      }
    ): Promise<AudienceInsight[]> => {
      const { data } = await api.get('/social/analytics/audience', { params: filters });
      return data;
    },

    /**
     * Analyze audience segment
     */
    analyzeAudienceSegment: async (
      segmentCriteria: {
        platforms: string[];
        filters: Record<string, any>;
        timeframe: { start: string; end: string };
        analysis: string[];
      }
    ): Promise<{
      segment: AudienceInsight['segmentation']['segments'][0];
      insights: Array<{
        type: string;
        finding: string;
        confidence: number;
        recommendations: string[];
      }>;
    }> => {
      const { data } = await api.post('/social/analytics/audience/analyze', segmentCriteria);
      return data;
    },

    /**
     * Create ROI analysis
     */
    createROIAnalysis: async (
      analysisData: Omit<ROIAnalysis, 'id' | 'revenue' | 'metrics' | 'conversion' | 'performance' | 'optimization' | 'forecasting' | 'metadata'>
    ): Promise<ROIAnalysis> => {
      const { data } = await api.post('/social/analytics/roi', analysisData);
      return data;
    },

    /**
     * Calculate ROI
     */
    calculateROI: async (
      analysisId: string,
      options?: {
        includeAssisted?: boolean;
        attributionModel?: string;
        customMetrics?: string[];
      }
    ): Promise<ROIAnalysis> => {
      const { data } = await api.post(`/social/analytics/roi/${analysisId}/calculate`, options);
      return data;
    },

    /**
     * Get performance overview
     */
    getPerformanceOverview: async (
      timeframe: { start: string; end: string },
      filters?: {
        platforms?: string[];
        campaigns?: string[];
        metrics?: string[];
      }
    ): Promise<{
      summary: {
        totalReach: number;
        totalEngagement: number;
        totalConversions: number;
        totalRevenue: number;
        roi: number;
        topPerformer: string;
      };
      trends: Array<{
        date: string;
        metrics: Record<string, number>;
      }>;
      breakdown: {
        byPlatform: Record<string, Record<string, number>>;
        byCampaign: Record<string, Record<string, number>>;
        byContent: Array<{
          id: string;
          title: string;
          performance: Record<string, number>;
        }>;
      };
      insights: Array<{
        type: string;
        message: string;
        impact: string;
        actionable: boolean;
      }>;
    }> => {
      const { data } = await api.get('/social/analytics/overview', {
        params: { ...timeframe, ...filters },
      });
      return data;
    },

    /**
     * Export analytics data
     */
    exportData: async (
      request: {
        type: 'metrics' | 'dashboard' | 'report' | 'raw_data';
        ids?: string[];
        timeframe: { start: string; end: string };
        format: 'csv' | 'excel' | 'json' | 'pdf';
        filters?: Record<string, any>;
      }
    ): Promise<Blob> => {
      const { data } = await api.post('/social/analytics/export', request, {
        responseType: 'blob',
      });
      return data;
    },

    /**
     * Get real-time metrics
     */
    getRealTimeMetrics: async (
      metrics: string[],
      platforms?: string[]
    ): Promise<Record<string, {
      value: number;
      change: number;
      timestamp: string;
      trend: 'up' | 'down' | 'stable';
    }>> => {
      const { data } = await api.get('/social/analytics/real-time', {
        params: { metrics, platforms },
      });
      return data;
    },

    /**
     * Create alert
     */
    createAlert: async (
      alertData: {
        name: string;
        metric: string;
        condition: string;
        threshold: number;
        recipients: string[];
        enabled: boolean;
      }
    ): Promise<{
      id: string;
      status: 'created';
    }> => {
      const { data } = await api.post('/social/analytics/alerts', alertData);
      return data;
    },

    /**
     * Get benchmark data
     */
    getBenchmarks: async (
      industry?: string,
      metrics?: string[]
    ): Promise<Record<string, {
      industry: number;
      topQuartile: number;
      median: number;
      bottomQuartile: number;
      source: string;
      date: string;
    }>> => {
      const { data } = await api.get('/social/analytics/benchmarks', {
        params: { industry, metrics },
      });
      return data;
    },

    /**
     * Schedule analysis
     */
    scheduleAnalysis: async (
      analysisConfig: {
        type: 'competitor' | 'trend' | 'audience' | 'roi' | 'performance';
        frequency: 'daily' | 'weekly' | 'monthly';
        time: string;
        timezone: string;
        recipients: string[];
        enabled: boolean;
        parameters: Record<string, any>;
      }
    ): Promise<{
      scheduleId: string;
      nextRun: string;
    }> => {
      const { data } = await api.post('/social/analytics/schedule', analysisConfig);
      return data;
    },
  };

  export default socialAnalyticsAPI;