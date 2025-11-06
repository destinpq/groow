/**
 * SEO Optimization API Service
 * 
 * Comprehensive SEO management including meta tags, schema markup, 
 * sitemap generation, keyword tracking, and SEO analytics
 */

import api from './client';

// SEO Types and Interfaces
export interface SEOMetaTags {
  id: string;
  pageId?: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchemaMarkup {
  id: string;
  pageId?: string;
  url: string;
  type: 'Organization' | 'Product' | 'Article' | 'BreadcrumbList' | 'FAQ' | 'Review' | 'LocalBusiness' | 'WebSite';
  schema: any; // JSON schema object
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface SitemapEntry {
  id: string;
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  isActive: boolean;
  pageType: 'home' | 'category' | 'product' | 'blog' | 'static' | 'other';
  alternateUrls?: Array<{
    hreflang: string;
    url: string;
  }>;
}

export interface KeywordTracking {
  id: string;
  keyword: string;
  targetUrl: string;
  currentPosition?: number;
  previousPosition?: number;
  searchVolume?: number;
  difficulty?: number;
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  status: 'tracking' | 'paused' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  positions?: Array<{
    date: string;
    position: number;
    page: number;
    searchEngine: 'google' | 'bing' | 'yahoo';
  }>;
}

export interface SEOAnalytics {
  id: string;
  url: string;
  date: string;
  organicTraffic: number;
  organicClicks: number;
  organicImpressions: number;
  averagePosition: number;
  clickThroughRate: number;
  pageLoadSpeed: number;
  mobileUsability: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  technicalIssues: string[];
  recommendations: string[];
}

export interface SEOAudit {
  id: string;
  url: string;
  auditDate: string;
  overallScore: number;
  technicalScore: number;
  contentScore: number;
  userExperienceScore: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  issues: Array<{
    type: 'error' | 'warning' | 'notice';
    category: 'technical' | 'content' | 'ux' | 'performance';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    howToFix: string;
    affectedElements?: string[];
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    estimatedImpact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  previousAuditId?: string;
  nextAuditScheduled?: string;
}

export interface CompetitorAnalysis {
  id: string;
  competitorDomain: string;
  competitorName: string;
  analysisDate: string;
  metrics: {
    estimatedTraffic: number;
    keywordCount: number;
    backlinks: number;
    domainAuthority: number;
    averagePosition: number;
  };
  topKeywords: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    traffic: number;
    difficulty: number;
  }>;
  contentGaps: Array<{
    keyword: string;
    theirPosition: number;
    ourPosition?: number;
    opportunity: 'high' | 'medium' | 'low';
    searchVolume: number;
  }>;
  topPages: Array<{
    url: string;
    title: string;
    estimatedTraffic: number;
    keywords: number;
    backlinks: number;
  }>;
}

export interface SEOTemplate {
  id: string;
  name: string;
  description: string;
  pageType: string;
  metaTemplate: {
    titleTemplate: string;
    descriptionTemplate: string;
    keywordsTemplate?: string;
  };
  schemaTemplate?: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SEOSettings {
  id: string;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  bingWebmasterToolsId?: string;
  googleTagManagerId?: string;
  structuredDataEnabled: boolean;
  sitemapEnabled: boolean;
  robotsTxtContent: string;
  redirectRules: Array<{
    from: string;
    to: string;
    type: '301' | '302' | '307' | '308';
    isActive: boolean;
  }>;
  canonicalRules: Array<{
    pattern: string;
    canonical: string;
    isActive: boolean;
  }>;
  hreflangRules: Array<{
    pattern: string;
    rules: Array<{
      hreflang: string;
      url: string;
    }>;
    isActive: boolean;
  }>;
}

// SEO API Service
export const seoAPI = {
  // Meta Tags Management
  async getMetaTags(filters?: {
    url?: string;
    pageType?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    data: SEOMetaTags[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/seo/meta-tags', { params: filters });
    return response.data;
  },

  async getMetaTagsById(id: string): Promise<SEOMetaTags> {
    const response = await api.get(`/seo/meta-tags/${id}`);
    return response.data;
  },

  async getMetaTagsByUrl(url: string): Promise<SEOMetaTags | null> {
    const response = await api.get(`/seo/meta-tags/by-url`, { params: { url } });
    return response.data;
  },

  async createMetaTags(data: Omit<SEOMetaTags, 'id' | 'createdAt' | 'updatedAt'>): Promise<SEOMetaTags> {
    const response = await api.post('/seo/meta-tags', data);
    return response.data;
  },

  async updateMetaTags(id: string, data: Partial<SEOMetaTags>): Promise<SEOMetaTags> {
    const response = await api.patch(`/seo/meta-tags/${id}`, data);
    return response.data;
  },

  async deleteMetaTags(id: string): Promise<void> {
    await api.delete(`/seo/meta-tags/${id}`);
  },

  async bulkUpdateMetaTags(updates: Array<{
    id: string;
    data: Partial<SEOMetaTags>;
  }>): Promise<{ updated: number; failed: number; errors?: string[] }> {
    const response = await api.patch('/seo/meta-tags/bulk', { updates });
    return response.data;
  },

  // Schema Markup Management
  async getSchemaMarkup(filters?: {
    url?: string;
    type?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    data: SchemaMarkup[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/seo/schema-markup', { params: filters });
    return response.data;
  },

  async createSchemaMarkup(data: Omit<SchemaMarkup, 'id' | 'createdAt' | 'updatedAt'>): Promise<SchemaMarkup> {
    const response = await api.post('/seo/schema-markup', data);
    return response.data;
  },

  async updateSchemaMarkup(id: string, data: Partial<SchemaMarkup>): Promise<SchemaMarkup> {
    const response = await api.patch(`/seo/schema-markup/${id}`, data);
    return response.data;
  },

  async deleteSchemaMarkup(id: string): Promise<void> {
    await api.delete(`/seo/schema-markup/${id}`);
  },

  async validateSchema(schema: any): Promise<{
    isValid: boolean;
    errors?: string[];
    warnings?: string[];
    suggestions?: string[];
  }> {
    const response = await api.post('/seo/schema-markup/validate', { schema });
    return response.data;
  },

  // Sitemap Management
  async getSitemapEntries(filters?: {
    pageType?: string;
    isActive?: boolean;
    lastModifiedFrom?: string;
    lastModifiedTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: SitemapEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/seo/sitemap/entries', { params: filters });
    return response.data;
  },

  async createSitemapEntry(data: Omit<SitemapEntry, 'id'>): Promise<SitemapEntry> {
    const response = await api.post('/seo/sitemap/entries', data);
    return response.data;
  },

  async updateSitemapEntry(id: string, data: Partial<SitemapEntry>): Promise<SitemapEntry> {
    const response = await api.patch(`/seo/sitemap/entries/${id}`, data);
    return response.data;
  },

  async deleteSitemapEntry(id: string): Promise<void> {
    await api.delete(`/seo/sitemap/entries/${id}`);
  },

  async generateSitemap(): Promise<{
    success: boolean;
    entriesCount: number;
    sitemapUrl: string;
    lastGenerated: string;
  }> {
    const response = await api.post('/seo/sitemap/generate');
    return response.data;
  },

  async getSitemapXml(): Promise<string> {
    const response = await api.get('/seo/sitemap.xml', {
      headers: { Accept: 'application/xml' }
    });
    return response.data;
  },

  // Keyword Tracking
  async getKeywords(filters?: {
    status?: string;
    intent?: string;
    tags?: string[];
    minPosition?: number;
    maxPosition?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: KeywordTracking[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/seo/keywords', { params: filters });
    return response.data;
  },

  async addKeyword(data: Omit<KeywordTracking, 'id' | 'createdAt' | 'updatedAt' | 'positions'>): Promise<KeywordTracking> {
    const response = await api.post('/seo/keywords', data);
    return response.data;
  },

  async updateKeyword(id: string, data: Partial<KeywordTracking>): Promise<KeywordTracking> {
    const response = await api.patch(`/seo/keywords/${id}`, data);
    return response.data;
  },

  async deleteKeyword(id: string): Promise<void> {
    await api.delete(`/seo/keywords/${id}`);
  },

  async refreshKeywordPositions(keywordIds?: string[]): Promise<{
    updated: number;
    failed: number;
    errors?: string[];
  }> {
    const response = await api.post('/seo/keywords/refresh-positions', { keywordIds });
    return response.data;
  },

  async getKeywordSuggestions(seed: string, limit?: number): Promise<Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    intent: string;
    competition: number;
  }>> {
    const response = await api.get('/seo/keywords/suggestions', {
      params: { seed, limit }
    });
    return response.data;
  },

  // SEO Analytics
  async getAnalytics(filters?: {
    url?: string;
    dateFrom?: string;
    dateTo?: string;
    groupBy?: 'day' | 'week' | 'month';
    page?: number;
    limit?: number;
  }): Promise<{
    data: SEOAnalytics[];
    total: number;
    summary: {
      totalTraffic: number;
      totalClicks: number;
      totalImpressions: number;
      averageCTR: number;
      averagePosition: number;
      averagePageSpeed: number;
    };
  }> {
    const response = await api.get('/seo/analytics', { params: filters });
    return response.data;
  },

  async getTopPages(limit?: number, dateRange?: string): Promise<Array<{
    url: string;
    title: string;
    traffic: number;
    clicks: number;
    impressions: number;
    position: number;
    ctr: number;
  }>> {
    const response = await api.get('/seo/analytics/top-pages', {
      params: { limit, dateRange }
    });
    return response.data;
  },

  async getTopKeywords(limit?: number, dateRange?: string): Promise<Array<{
    keyword: string;
    clicks: number;
    impressions: number;
    position: number;
    ctr: number;
    traffic: number;
  }>> {
    const response = await api.get('/seo/analytics/top-keywords', {
      params: { limit, dateRange }
    });
    return response.data;
  },

  // SEO Audits
  async getAudits(filters?: {
    url?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: SEOAudit[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await api.get('/seo/audits', { params: filters });
    return response.data;
  },

  async createAudit(data: { url: string; auditType?: 'full' | 'technical' | 'content' }): Promise<SEOAudit> {
    const response = await api.post('/seo/audits', data);
    return response.data;
  },

  async getAuditById(id: string): Promise<SEOAudit> {
    const response = await api.get(`/seo/audits/${id}`);
    return response.data;
  },

  async scheduleAudit(data: {
    url: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    auditType?: 'full' | 'technical' | 'content';
  }): Promise<{ success: boolean; scheduleId: string }> {
    const response = await api.post('/seo/audits/schedule', data);
    return response.data;
  },

  // Competitor Analysis
  async getCompetitors(): Promise<CompetitorAnalysis[]> {
    const response = await api.get('/seo/competitors');
    return response.data;
  },

  async addCompetitor(domain: string, name?: string): Promise<CompetitorAnalysis> {
    const response = await api.post('/seo/competitors', { domain, name });
    return response.data;
  },

  async updateCompetitorAnalysis(id: string): Promise<CompetitorAnalysis> {
    const response = await api.post(`/seo/competitors/${id}/analyze`);
    return response.data;
  },

  async removeCompetitor(id: string): Promise<void> {
    await api.delete(`/seo/competitors/${id}`);
  },

  // SEO Templates
  async getTemplates(): Promise<SEOTemplate[]> {
    const response = await api.get('/seo/templates');
    return response.data;
  },

  async createTemplate(data: Omit<SEOTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<SEOTemplate> {
    const response = await api.post('/seo/templates', data);
    return response.data;
  },

  async updateTemplate(id: string, data: Partial<SEOTemplate>): Promise<SEOTemplate> {
    const response = await api.patch(`/seo/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/seo/templates/${id}`);
  },

  async applyTemplate(templateId: string, urls: string[]): Promise<{
    applied: number;
    failed: number;
    errors?: string[];
  }> {
    const response = await api.post(`/seo/templates/${templateId}/apply`, { urls });
    return response.data;
  },

  // SEO Settings
  async getSettings(): Promise<SEOSettings> {
    const response = await api.get('/seo/settings');
    return response.data;
  },

  async updateSettings(data: Partial<SEOSettings>): Promise<SEOSettings> {
    const response = await api.patch('/seo/settings', data);
    return response.data;
  },

  // Robots.txt Management
  async getRobotsTxt(): Promise<string> {
    const response = await api.get('/seo/robots.txt', {
      headers: { Accept: 'text/plain' }
    });
    return response.data;
  },

  async updateRobotsTxt(content: string): Promise<{ success: boolean }> {
    const response = await api.put('/seo/robots.txt', { content });
    return response.data;
  },

  // Redirects Management
  async getRedirects(): Promise<Array<{
    id: string;
    from: string;
    to: string;
    type: string;
    hits: number;
    isActive: boolean;
    createdAt: string;
  }>> {
    const response = await api.get('/seo/redirects');
    return response.data;
  },

  async createRedirect(data: {
    from: string;
    to: string;
    type: '301' | '302' | '307' | '308';
  }): Promise<{ id: string; success: boolean }> {
    const response = await api.post('/seo/redirects', data);
    return response.data;
  },

  async deleteRedirect(id: string): Promise<void> {
    await api.delete(`/seo/redirects/${id}`);
  },

  // SEO Reporting
  async generateReport(params: {
    type: 'overview' | 'keywords' | 'audit' | 'competitors';
    dateFrom: string;
    dateTo: string;
    format: 'pdf' | 'excel' | 'csv';
    includeCharts?: boolean;
  }): Promise<Blob> {
    const response = await api.post('/seo/reports/generate', params, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default seoAPI;