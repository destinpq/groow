/**
 * CMS API Service
 * Handles all Content Management System operations including:
 * - Pages management (create, read, update, delete)
 * - Banners management for marketing campaigns
 * - FAQs for customer support
 * - Menus for navigation
 * - Media library for asset management
 * - Testimonials and reviews
 * - Social media links
 */

import request from './client';

// ============================================
// TypeScript Interfaces
// ============================================

export interface CMSPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: number;
    name: string;
  };
}

export interface CMSBanner {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  placement: 'home-hero' | 'home-secondary' | 'category' | 'product' | 'sidebar';
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  isActive: boolean;
  targetBlank?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CMSFAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSMenu {
  id: number;
  name: string;
  location: 'header' | 'footer' | 'sidebar' | 'mobile';
  items: CMSMenuItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CMSMenuItem {
  id: number;
  label: string;
  url: string;
  icon?: string;
  targetBlank?: boolean;
  displayOrder: number;
  parentId?: number;
  children?: CMSMenuItem[];
}

export interface CMSMedia {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  title?: string;
  description?: string;
  folder?: string;
  tags?: string[];
  uploadedBy: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CMSTestimonial {
  id: number;
  customerName: string;
  customerTitle?: string;
  customerImage?: string;
  content: string;
  rating: number;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSSocialLink {
  id: number;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'pinterest' | 'tiktok';
  url: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  followerCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  viewCount: number;
  commentCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSNewsletter {
  id: number;
  subject: string;
  content: string;
  templateId?: number;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CMSAnnouncement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  placement: 'global' | 'homepage' | 'checkout' | 'account';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isDismissible: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Pages API
// ============================================

export const cmsAPI = {
  // Pages Management
  pages: {
    getAll: (params?: { status?: string; search?: string }) => 
      request.get<CMSPage[]>('/cms/pages', { params }),
    
    getById: (id: number) => 
      request.get<CMSPage>(`/cms/pages/${id}`),
    
    getBySlug: (slug: string) => 
      request.get<CMSPage>(`/cms/pages/slug/${slug}`),
    
    create: (data: Partial<CMSPage>) => 
      request.post<CMSPage>('/cms/pages', data),
    
    update: (id: number, data: Partial<CMSPage>) => 
      request.put<CMSPage>(`/cms/pages/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/pages/${id}`),
    
    publish: (id: number) => 
      request.post(`/cms/pages/${id}/publish`),
    
    unpublish: (id: number) => 
      request.post(`/cms/pages/${id}/unpublish`),
  },

  // Banners Management
  banners: {
    getAll: (params?: { placement?: string; active?: boolean }) => 
      request.get<CMSBanner[]>('/cms/banners', { params }),
    
    getActive: (placement?: string) => 
      request.get<CMSBanner[]>('/cms/banners/active', { params: { placement } }),
    
    getById: (id: number) => 
      request.get<CMSBanner>(`/cms/banners/${id}`),
    
    create: (data: Partial<CMSBanner>) => 
      request.post<CMSBanner>('/cms/banners', data),
    
    update: (id: number, data: Partial<CMSBanner>) => 
      request.put<CMSBanner>(`/cms/banners/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/banners/${id}`),
    
    updateOrder: (orders: { id: number; displayOrder: number }[]) => 
      request.post('/cms/banners/reorder', { orders }),
  },

  // FAQs Management
  faqs: {
    getAll: (params?: { category?: string; active?: boolean }) => 
      request.get<CMSFAQ[]>('/cms/faqs', { params }),
    
    getActive: (category?: string) => 
      request.get<CMSFAQ[]>('/cms/faqs/active', { params: { category } }),
    
    getById: (id: number) => 
      request.get<CMSFAQ>(`/cms/faqs/${id}`),
    
    create: (data: Partial<CMSFAQ>) => 
      request.post<CMSFAQ>('/cms/faqs', data),
    
    update: (id: number, data: Partial<CMSFAQ>) => 
      request.put<CMSFAQ>(`/cms/faqs/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/faqs/${id}`),
    
    markHelpful: (id: number) => 
      request.post(`/cms/faqs/${id}/helpful`),
    
    incrementView: (id: number) => 
      request.post(`/cms/faqs/${id}/view`),
  },

  // Menus Management
  menus: {
    getAll: () => 
      request.get<CMSMenu[]>('/cms/menus'),
    
    getByLocation: (location: string) => 
      request.get<CMSMenu>(`/cms/menus/location/${location}`),
    
    getById: (id: number) => 
      request.get<CMSMenu>(`/cms/menus/${id}`),
    
    create: (data: Partial<CMSMenu>) => 
      request.post<CMSMenu>('/cms/menus', data),
    
    update: (id: number, data: Partial<CMSMenu>) => 
      request.put<CMSMenu>(`/cms/menus/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/menus/${id}`),
    
    addItem: (menuId: number, item: Partial<CMSMenuItem>) => 
      request.post<CMSMenuItem>(`/cms/menus/${menuId}/items`, item),
    
    updateItem: (menuId: number, itemId: number, data: Partial<CMSMenuItem>) => 
      request.put<CMSMenuItem>(`/cms/menus/${menuId}/items/${itemId}`, data),
    
    deleteItem: (menuId: number, itemId: number) => 
      request.delete(`/cms/menus/${menuId}/items/${itemId}`),
    
    reorderItems: (menuId: number, orders: { id: number; displayOrder: number }[]) => 
      request.post(`/cms/menus/${menuId}/reorder`, { orders }),
  },

  // Media Library
  media: {
    getAll: (params?: { folder?: string; fileType?: string; search?: string }) => 
      request.get<CMSMedia[]>('/cms/media', { params }),
    
    getById: (id: number) => 
      request.get<CMSMedia>(`/cms/media/${id}`),
    
    upload: (file: File, data?: { folder?: string; alt?: string; title?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (data?.folder) formData.append('folder', data.folder);
      if (data?.alt) formData.append('alt', data.alt);
      if (data?.title) formData.append('title', data.title);
      return request.post<CMSMedia>('/cms/media/upload', formData);
    },
    
    update: (id: number, data: Partial<CMSMedia>) => 
      request.put<CMSMedia>(`/cms/media/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/media/${id}`),
    
    bulkDelete: (ids: number[]) => 
      request.post('/cms/media/bulk-delete', { ids }),
    
    getFolders: () => 
      request.get<string[]>('/cms/media/folders'),
    
    createFolder: (name: string) => 
      request.post('/cms/media/folders', { name }),
  },

  // Testimonials Management
  testimonials: {
    getAll: (params?: { active?: boolean; featured?: boolean }) => 
      request.get<CMSTestimonial[]>('/cms/testimonials', { params }),
    
    getActive: () => 
      request.get<CMSTestimonial[]>('/cms/testimonials/active'),
    
    getFeatured: () => 
      request.get<CMSTestimonial[]>('/cms/testimonials/featured'),
    
    getById: (id: number) => 
      request.get<CMSTestimonial>(`/cms/testimonials/${id}`),
    
    create: (data: Partial<CMSTestimonial>) => 
      request.post<CMSTestimonial>('/cms/testimonials', data),
    
    update: (id: number, data: Partial<CMSTestimonial>) => 
      request.put<CMSTestimonial>(`/cms/testimonials/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/testimonials/${id}`),
  },

  // Social Links Management
  socialLinks: {
    getAll: (params?: { active?: boolean }) => 
      request.get<CMSSocialLink[]>('/cms/social-links', { params }),
    
    getActive: () => 
      request.get<CMSSocialLink[]>('/cms/social-links/active'),
    
    getById: (id: number) => 
      request.get<CMSSocialLink>(`/cms/social-links/${id}`),
    
    create: (data: Partial<CMSSocialLink>) => 
      request.post<CMSSocialLink>('/cms/social-links', data),
    
    update: (id: number, data: Partial<CMSSocialLink>) => 
      request.put<CMSSocialLink>(`/cms/social-links/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/social-links/${id}`),
  },

  // Blog Management
  blog: {
    getAll: (params?: { status?: string; category?: string; search?: string }) => 
      request.get<CMSBlogPost[]>('/cms/blog', { params }),
    
    getPublished: (params?: { category?: string; limit?: number }) => 
      request.get<CMSBlogPost[]>('/cms/blog/published', { params }),
    
    getById: (id: number) => 
      request.get<CMSBlogPost>(`/cms/blog/${id}`),
    
    getBySlug: (slug: string) => 
      request.get<CMSBlogPost>(`/cms/blog/slug/${slug}`),
    
    create: (data: Partial<CMSBlogPost>) => 
      request.post<CMSBlogPost>('/cms/blog', data),
    
    update: (id: number, data: Partial<CMSBlogPost>) => 
      request.put<CMSBlogPost>(`/cms/blog/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/blog/${id}`),
    
    publish: (id: number) => 
      request.post(`/cms/blog/${id}/publish`),
    
    incrementView: (id: number) => 
      request.post(`/cms/blog/${id}/view`),
  },

  // Newsletter Management
  newsletter: {
    getAll: (params?: { status?: string }) => 
      request.get<CMSNewsletter[]>('/cms/newsletter', { params }),
    
    getById: (id: number) => 
      request.get<CMSNewsletter>(`/cms/newsletter/${id}`),
    
    create: (data: Partial<CMSNewsletter>) => 
      request.post<CMSNewsletter>('/cms/newsletter', data),
    
    update: (id: number, data: Partial<CMSNewsletter>) => 
      request.put<CMSNewsletter>(`/cms/newsletter/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/newsletter/${id}`),
    
    send: (id: number) => 
      request.post(`/cms/newsletter/${id}/send`),
    
    schedule: (id: number, scheduledAt: string) => 
      request.post(`/cms/newsletter/${id}/schedule`, { scheduledAt }),
    
    testSend: (id: number, emails: string[]) => 
      request.post(`/cms/newsletter/${id}/test`, { emails }),
    
    getStats: (id: number) => 
      request.get(`/cms/newsletter/${id}/stats`),
  },

  // Announcements Management
  announcements: {
    getAll: (params?: { active?: boolean; placement?: string }) => 
      request.get<CMSAnnouncement[]>('/cms/announcements', { params }),
    
    getActive: (placement?: string) => 
      request.get<CMSAnnouncement[]>('/cms/announcements/active', { params: { placement } }),
    
    getById: (id: number) => 
      request.get<CMSAnnouncement>(`/cms/announcements/${id}`),
    
    create: (data: Partial<CMSAnnouncement>) => 
      request.post<CMSAnnouncement>('/cms/announcements', data),
    
    update: (id: number, data: Partial<CMSAnnouncement>) => 
      request.put<CMSAnnouncement>(`/cms/announcements/${id}`, data),
    
    delete: (id: number) => 
      request.delete(`/cms/announcements/${id}`),
    
    activate: (id: number) => 
      request.post(`/cms/announcements/${id}/activate`),
    
    deactivate: (id: number) => 
      request.post(`/cms/announcements/${id}/deactivate`),
  },
};

export default cmsAPI;
