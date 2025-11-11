/**
 * Admin CMS Management API Services
 * Content management system functionality for administrators
 */
import { api } from './client';

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
  };
  featuredImage?: string;
  gallery?: string[];
  author: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  position: 'hero' | 'header' | 'sidebar' | 'footer' | 'popup';
  priority: number;
  status: 'active' | 'inactive' | 'scheduled';
  startDate?: string;
  endDate?: string;
  targetAudience?: {
    userType?: 'all' | 'guest' | 'customer' | 'vendor';
    location?: string[];
    devices?: ('desktop' | 'mobile' | 'tablet')[];
  };
  analytics: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CMSMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar' | 'mobile';
  items: CMSMenuItem[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CMSMenuItem {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'page' | 'category' | 'external';
  target: '_self' | '_blank';
  icon?: string;
  order: number;
  parent?: string;
  children?: CMSMenuItem[];
  permissions?: string[];
}

export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  alt?: string;
  caption?: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CMSTestimonial {
  id: string;
  customerName: string;
  customerTitle?: string;
  customerCompany?: string;
  customerImage?: string;
  content: string;
  rating: number;
  featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  source: 'manual' | 'imported' | 'review';
  productId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  template: string;
  status: 'draft' | 'published';
  seo?: Partial<CMSPage['seo']>;
  featuredImage?: string;
  gallery?: string[];
}

export interface CreateBannerData {
  title: string;
  description?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  position: CMSBanner['position'];
  priority: number;
  status: CMSBanner['status'];
  startDate?: string;
  endDate?: string;
  targetAudience?: CMSBanner['targetAudience'];
}

export interface CreateMenuData {
  name: string;
  location: CMSMenu['location'];
  items: Omit<CMSMenuItem, 'id'>[];
}

export const adminCMSAPI = {
  // Pages Management
  /**
   * Get all pages
   */
  getPages: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: CMSPage['status'];
      template?: string;
      search?: string;
    } = {}
  ) => {
    const { data } = await api.get('/admin/cms/pages', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Get page by ID
   */
  getPage: async (pageId: string): Promise<CMSPage> => {
    const { data } = await api.get(`/admin/cms/pages/${pageId}`);
    return data;
  },

  /**
   * Create new page
   */
  createPage: async (pageData: CreatePageData): Promise<CMSPage> => {
    const { data } = await api.post('/admin/cms/pages', pageData);
    return data;
  },

  /**
   * Update page
   */
  updatePage: async (pageId: string, updates: Partial<CreatePageData>): Promise<CMSPage> => {
    const { data } = await api.put(`/admin/cms/pages/${pageId}`, updates);
    return data;
  },

  /**
   * Delete page
   */
  deletePage: async (pageId: string): Promise<void> => {
    await api.delete(`/admin/cms/pages/${pageId}`);
  },

  /**
   * Publish page
   */
  publishPage: async (pageId: string): Promise<CMSPage> => {
    const { data } = await api.post(`/admin/cms/pages/${pageId}/publish`);
    return data;
  },

  /**
   * Duplicate page
   */
  duplicatePage: async (pageId: string, newTitle?: string): Promise<CMSPage> => {
    const { data } = await api.post(`/admin/cms/pages/${pageId}/duplicate`, {
      newTitle,
    });
    return data;
  },

  // Banners Management
  /**
   * Get all banners
   */
  getBanners: async (
    filters: {
      position?: CMSBanner['position'];
      status?: CMSBanner['status'];
    } = {}
  ): Promise<CMSBanner[]> => {
    const { data } = await api.get('/admin/cms/banners', { params: filters });
    return data;
  },

  /**
   * Get banner by ID
   */
  getBanner: async (bannerId: string): Promise<CMSBanner> => {
    const { data } = await api.get(`/admin/cms/banners/${bannerId}`);
    return data;
  },

  /**
   * Create banner
   */
  createBanner: async (bannerData: CreateBannerData): Promise<CMSBanner> => {
    const { data } = await api.post('/admin/cms/banners', bannerData);
    return data;
  },

  /**
   * Update banner
   */
  updateBanner: async (bannerId: string, updates: Partial<CreateBannerData>): Promise<CMSBanner> => {
    const { data } = await api.put(`/admin/cms/banners/${bannerId}`, updates);
    return data;
  },

  /**
   * Delete banner
   */
  deleteBanner: async (bannerId: string): Promise<void> => {
    await api.delete(`/admin/cms/banners/${bannerId}`);
  },

  /**
   * Get banner analytics
   */
  getBannerAnalytics: async (bannerId: string, period: 'week' | 'month' | 'year') => {
    const { data } = await api.get(`/admin/cms/banners/${bannerId}/analytics`, {
      params: { period },
    });
    return data;
  },

  // Menus Management
  /**
   * Get all menus
   */
  getMenus: async (): Promise<CMSMenu[]> => {
    const { data } = await api.get('/admin/cms/menus');
    return data;
  },

  /**
   * Get menu by ID
   */
  getMenu: async (menuId: string): Promise<CMSMenu> => {
    const { data } = await api.get(`/admin/cms/menus/${menuId}`);
    return data;
  },

  /**
   * Create menu
   */
  createMenu: async (menuData: CreateMenuData): Promise<CMSMenu> => {
    const { data } = await api.post('/admin/cms/menus', menuData);
    return data;
  },

  /**
   * Update menu
   */
  updateMenu: async (menuId: string, updates: Partial<CreateMenuData>): Promise<CMSMenu> => {
    const { data } = await api.put(`/admin/cms/menus/${menuId}`, updates);
    return data;
  },

  /**
   * Delete menu
   */
  deleteMenu: async (menuId: string): Promise<void> => {
    await api.delete(`/admin/cms/menus/${menuId}`);
  },

  /**
   * Reorder menu items
   */
  reorderMenuItems: async (menuId: string, items: Array<{ id: string; order: number }>) => {
    const { data } = await api.put(`/admin/cms/menus/${menuId}/reorder`, { items });
    return data;
  },

  // Media Library Management
  /**
   * Get media files
   */
  getMediaFiles: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      folder?: string;
      mimeType?: string;
      search?: string;
      tags?: string[];
    } = {}
  ) => {
    const { data } = await api.get('/admin/cms/media', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Upload media file
   */
  uploadMediaFile: async (
    file: File,
    folder: string = 'general',
    metadata?: { alt?: string; caption?: string; tags?: string[] }
  ): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const { data } = await api.post('/admin/cms/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Update media file metadata
   */
  updateMediaFile: async (
    fileId: string,
    metadata: { alt?: string; caption?: string; tags?: string[]; folder?: string }
  ): Promise<MediaFile> => {
    const { data } = await api.put(`/admin/cms/media/${fileId}`, metadata);
    return data;
  },

  /**
   * Delete media file
   */
  deleteMediaFile: async (fileId: string): Promise<void> => {
    await api.delete(`/admin/cms/media/${fileId}`);
  },

  /**
   * Create media folder
   */
  createMediaFolder: async (name: string, parent?: string) => {
    const { data } = await api.post('/admin/cms/media/folders', { name, parent });
    return data;
  },

  /**
   * Get media folders
   */
  getMediaFolders: async () => {
    const { data } = await api.get('/admin/cms/media/folders');
    return data;
  },

  // Testimonials Management
  /**
   * Get testimonials
   */
  getTestimonials: async (
    page: number = 1,
    limit: number = 20,
    filters: {
      status?: CMSTestimonial['status'];
      featured?: boolean;
      source?: CMSTestimonial['source'];
    } = {}
  ) => {
    const { data } = await api.get('/admin/cms/testimonials', {
      params: { page, limit, ...filters },
    });
    return data;
  },

  /**
   * Create testimonial
   */
  createTestimonial: async (testimonialData: {
    customerName: string;
    customerTitle?: string;
    customerCompany?: string;
    customerImage?: string;
    content: string;
    rating: number;
    featured?: boolean;
    productId?: string;
  }): Promise<CMSTestimonial> => {
    const { data } = await api.post('/admin/cms/testimonials', testimonialData);
    return data;
  },

  /**
   * Update testimonial
   */
  updateTestimonial: async (testimonialId: string, updates: Partial<CMSTestimonial>): Promise<CMSTestimonial> => {
    const { data } = await api.put(`/admin/cms/testimonials/${testimonialId}`, updates);
    return data;
  },

  /**
   * Approve testimonial
   */
  approveTestimonial: async (testimonialId: string): Promise<CMSTestimonial> => {
    const { data } = await api.post(`/admin/cms/testimonials/${testimonialId}/approve`);
    return data;
  },

  /**
   * Reject testimonial
   */
  rejectTestimonial: async (testimonialId: string): Promise<CMSTestimonial> => {
    const { data } = await api.post(`/admin/cms/testimonials/${testimonialId}/reject`);
    return data;
  },

  /**
   * Delete testimonial
   */
  deleteTestimonial: async (testimonialId: string): Promise<void> => {
    await api.delete(`/admin/cms/testimonials/${testimonialId}`);
  },

  // General CMS Functions
  /**
   * Get CMS settings
   */
  getCMSSettings: async () => {
    const { data } = await api.get('/admin/cms/settings');
    return data;
  },

  /**
   * Update CMS settings
   */
  updateCMSSettings: async (settings: Record<string, any>) => {
    const { data } = await api.put('/admin/cms/settings', settings);
    return data;
  },

  /**
   * Get page templates
   */
  getPageTemplates: async () => {
    const { data } = await api.get('/admin/cms/templates');
    return data;
  },

  /**
   * Clear CMS cache
   */
  clearCache: async () => {
    const { data } = await api.post('/admin/cms/cache/clear');
    return data;
  },
};

export default adminCMSAPI;