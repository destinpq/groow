import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// CMS ENTITY TYPES  
// ================================

export enum BannerPlacement {
  HOME_HERO = 'home_hero',
  HOME_MIDDLE = 'home_middle',
  CATEGORY_TOP = 'category_top',
  PRODUCT_SIDEBAR = 'product_sidebar',
  CHECKOUT_TOP = 'checkout_top',
  GLOBAL_HEADER = 'global_header',
  GLOBAL_FOOTER = 'global_footer'
}

export enum PageType {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
  LANDING = 'landing',
  CATEGORY = 'category',
  BLOG = 'blog'
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived'
}

export interface Banner extends BaseEntity {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  placement: BannerPlacement;
  priority: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  status: ContentStatus;
  targetAudience?: string;
  clickCount: number;
  impressionCount: number;
  metadata?: {
    altText?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonStyle?: string;
  };
}

export interface FAQ extends BaseEntity {
  id: string;
  question: string;
  answer: string;
  category: string;
  priority: number;
  isActive: boolean;
  status: ContentStatus;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  tags?: string[];
  relatedFaqs?: string[];
  lastUpdatedBy?: string;
}

export interface Page extends BaseEntity {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: PageType;
  status: ContentStatus;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImage?: string;
  template?: string;
  parentPageId?: string;
  sortOrder?: number;
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  viewCount: number;
  lastModifiedBy?: string;
  customFields?: Record<string, any>;
  breadcrumbs?: {
    title: string;
    slug: string;
  }[];
  relatedPages?: {
    id: string;
    title: string;
    slug: string;
  }[];
}

export interface Menu extends BaseEntity {
  id: string;
  name: string;
  slug: string;
  type: 'header' | 'footer' | 'sidebar';
  isActive: boolean;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  title: string;
  url?: string;
  pageSlug?: string;
  categoryId?: string;
  type: 'link' | 'page' | 'category' | 'submenu';
  target: '_self' | '_blank';
  cssClass?: string;
  icon?: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
  isVisible: boolean;
  permission?: string;
}

export interface Widget extends BaseEntity {
  id: string;
  name: string;
  type: 'text' | 'image' | 'product_carousel' | 'category_grid' | 'html' | 'form';
  title?: string;
  content?: string;
  config: Record<string, any>;
  placement: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  targetPages?: string[];
  sortOrder: number;
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface CreateBannerRequest {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  placement: BannerPlacement;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  targetAudience?: string;
  metadata?: Record<string, any>;
}

export interface CreateBannerResponse {
  banner: Banner;
  message: string;
}

export interface GetBannersResponse {
  banners: Banner[];
}

export interface GetActiveBannersResponse {
  banners: Banner[];
  placement?: BannerPlacement;
}

export interface UpdateBannerResponse {
  banner: Banner;
  message: string;
}

export interface DeleteBannerResponse {
  message: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category: string;
  priority?: number;
  isActive?: boolean;
  tags?: string[];
  relatedFaqs?: string[];
}

export interface CreateFAQResponse {
  faq: FAQ;
  message: string;
}

export interface GetFAQsResponse {
  faqs: FAQ[];
  categories?: string[];
}

export interface GetActiveFAQsResponse {
  faqs: FAQ[];
  category?: string;
}

export interface CreatePageRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: PageType;
  status?: ContentStatus;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  featuredImage?: string;
  template?: string;
  parentPageId?: string;
  sortOrder?: number;
  publishedAt?: Date;
  scheduledAt?: Date;
  customFields?: Record<string, any>;
}

export interface CreatePageResponse {
  page: Page;
  message: string;
}

export interface GetPagesResponse {
  pages: Page[];
  total?: number;
}

export interface GetPageResponse {
  page: Page;
}

export interface CreateMenuRequest {
  name: string;
  slug: string;
  type: 'header' | 'footer' | 'sidebar';
  items: Omit<MenuItem, 'id'>[];
}

export interface CreateMenuResponse {
  menu: Menu;
  message: string;
}

export interface GetMenusResponse {
  menus: Menu[];
}

export interface CreateWidgetRequest {
  name: string;
  type: 'text' | 'image' | 'product_carousel' | 'category_grid' | 'html' | 'form';
  title?: string;
  content?: string;
  config: Record<string, any>;
  placement: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  targetPages?: string[];
  sortOrder?: number;
}

export interface CreateWidgetResponse {
  widget: Widget;
  message: string;
}

export interface GetWidgetsResponse {
  widgets: Widget[];
  placements?: string[];
}

export interface CMSAnalytics {
  totalPages: number;
  totalBanners: number;
  totalFAQs: number;
  totalMenus: number;
  totalWidgets: number;
  pageViews: number;
  bannerClicks: number;
  faqViews: number;
  topPages: {
    pageId: string;
    title: string;
    slug: string;
    views: number;
  }[];
  topBanners: {
    bannerId: string;
    title: string;
    clicks: number;
    impressions: number;
    ctr: number;
  }[];
  faqPerformance: {
    faqId: string;
    question: string;
    views: number;
    helpfulVotes: number;
    helpfulRate: number;
  }[];
}

// ================================
// FILTER TYPES
// ================================

export interface BannerFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  placement?: BannerPlacement;
  isActive?: boolean;
  status?: ContentStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface FAQFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  category?: string;
  isActive?: boolean;
  status?: ContentStatus;
  search?: string;
  tags?: string[];
}

export interface PageFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  type?: PageType;
  status?: ContentStatus;
  isActive?: boolean;
  parentPageId?: string;
  search?: string;
  authorId?: string;
}

// ================================
// CMS API INTERFACE
// ================================

export interface CmsAPI {
  // Banner Management
  createBanner(request: CreateBannerRequest): Promise<ApiResponse<CreateBannerResponse>>;
  getAllBanners(filter?: BannerFilter): Promise<ApiResponse<GetBannersResponse>>;
  getActiveBanners(placement?: BannerPlacement): Promise<ApiResponse<GetActiveBannersResponse>>;
  getBannerById(id: string): Promise<ApiResponse<{ banner: Banner }>>;
  updateBanner(id: string, request: Partial<CreateBannerRequest>): Promise<ApiResponse<UpdateBannerResponse>>;
  deleteBanner(id: string): Promise<ApiResponse<DeleteBannerResponse>>;
  
  // FAQ Management
  createFAQ(request: CreateFAQRequest): Promise<ApiResponse<CreateFAQResponse>>;
  getAllFAQs(filter?: FAQFilter): Promise<ApiResponse<GetFAQsResponse>>;
  getActiveFAQs(category?: string): Promise<ApiResponse<GetActiveFAQsResponse>>;
  getFAQById(id: string): Promise<ApiResponse<{ faq: FAQ }>>;
  updateFAQ(id: string, request: Partial<CreateFAQRequest>): Promise<ApiResponse<CreateFAQResponse>>;
  deleteFAQ(id: string): Promise<ApiResponse<{ message: string }>>;
  getFAQCategories(): Promise<ApiResponse<{ categories: string[] }>>;
  
  // Page Management
  createPage(request: CreatePageRequest): Promise<ApiResponse<CreatePageResponse>>;
  getAllPages(filter?: PageFilter): Promise<ApiResponse<GetPagesResponse>>;
  getPageBySlug(slug: string): Promise<ApiResponse<GetPageResponse>>;
  getPageById(id: string): Promise<ApiResponse<GetPageResponse>>;
  updatePage(id: string, request: Partial<CreatePageRequest>): Promise<ApiResponse<CreatePageResponse>>;
  deletePage(id: string): Promise<ApiResponse<{ message: string }>>;
  duplicatePage(id: string): Promise<ApiResponse<CreatePageResponse>>;
  
  // Menu Management
  createMenu(request: CreateMenuRequest): Promise<ApiResponse<CreateMenuResponse>>;
  getAllMenus(): Promise<ApiResponse<GetMenusResponse>>;
  getMenuBySlug(slug: string): Promise<ApiResponse<{ menu: Menu }>>;
  updateMenu(id: string, request: Partial<CreateMenuRequest>): Promise<ApiResponse<CreateMenuResponse>>;
  deleteMenu(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // Widget Management
  createWidget(request: CreateWidgetRequest): Promise<ApiResponse<CreateWidgetResponse>>;
  getAllWidgets(placement?: string): Promise<ApiResponse<GetWidgetsResponse>>;
  getWidgetById(id: string): Promise<ApiResponse<{ widget: Widget }>>;
  updateWidget(id: string, request: Partial<CreateWidgetRequest>): Promise<ApiResponse<CreateWidgetResponse>>;
  deleteWidget(id: string): Promise<ApiResponse<{ message: string }>>;
  getWidgetPlacements(): Promise<ApiResponse<{ placements: string[] }>>;
  
  // Content Analytics
  getCMSAnalytics(period?: string): Promise<ApiResponse<CMSAnalytics>>;
  trackBannerClick(bannerId: string): Promise<ApiResponse<{ success: boolean }>>;
  trackBannerImpression(bannerId: string): Promise<ApiResponse<{ success: boolean }>>;
  trackPageView(pageId: string): Promise<ApiResponse<{ success: boolean }>>;
  voteFAQHelpful(faqId: string, helpful: boolean): Promise<ApiResponse<{ faq: FAQ }>>;
  
  // Content Search
  searchContent(query: string, types?: ('banner' | 'faq' | 'page' | 'widget')[]): Promise<ApiResponse<{
    banners: Banner[];
    faqs: FAQ[];
    pages: Page[];
    widgets: Widget[];
    total: number;
  }>>;
}