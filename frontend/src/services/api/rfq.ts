import api from './client';
import { PaginatedResponse } from './products';

// Types
export interface RFQ {
  id: string;
  rfqNumber: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  budget?: number;
  deadline?: string;
  attachments?: string[];
  status: 'open' | 'quoted' | 'closed' | 'cancelled';
  quotationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  vendorLogo?: string;
  price: number;
  quantity: number;
  moq: number;
  deliveryTime: string;
  validUntil: string;
  notes?: string;
  attachments?: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateRFQData {
  title: string;
  description: string;
  category: string;
  quantity: number;
  budget?: number;
  deadline?: string;
  attachments?: string[];
}

export interface CreateQuotationData {
  rfqId: string;
  price: number;
  quantity: number;
  moq: number;
  deliveryTime: string;
  validUntil: string;
  notes?: string;
  attachments?: string[];
}

export interface RFQMessage {
  id: string;
  rfqId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'vendor';
  message: string;
  attachments?: string[];
  createdAt: string;
}

// RFQ API Service
export const rfqAPI = {
  // Create RFQ (customer)
  create: async (data: CreateRFQData): Promise<RFQ> => {
    const response = await api.post<RFQ>('/rfq', data);
    return response.data;
  },

  // Get all RFQs
  getAll: async (filters?: {
    status?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<RFQ>> => {
    const response = await api.get<PaginatedResponse<RFQ>>('/rfq', {
      params: filters,
    });
    return response.data;
  },

  // Get RFQ by ID
  getById: async (id: string): Promise<RFQ> => {
    const response = await api.get<RFQ>(`/rfq/${id}`);
    return response.data;
  },

  // Update RFQ
  update: async (id: string, data: Partial<CreateRFQData>): Promise<RFQ> => {
    const response = await api.put<RFQ>(`/rfq/${id}`, data);
    return response.data;
  },

  // Cancel RFQ
  cancel: async (id: string): Promise<RFQ> => {
    const response = await api.post<RFQ>(`/rfq/${id}/cancel`);
    return response.data;
  },

  // Get quotations for RFQ
  getQuotations: async (rfqId: string): Promise<Quotation[]> => {
    const response = await api.get<Quotation[]>(`/rfq/${rfqId}/quotations`);
    return response.data;
  },

  // Create quotation (vendor)
  createQuotation: async (data: CreateQuotationData): Promise<Quotation> => {
    const response = await api.post<Quotation>('/rfq/quotations', data);
    return response.data;
  },

  // Accept quotation (customer)
  acceptQuotation: async (quotationId: string): Promise<Quotation> => {
    const response = await api.post<Quotation>(`/rfq/quotations/${quotationId}/accept`);
    return response.data;
  },

  // Reject quotation (customer)
  rejectQuotation: async (quotationId: string, reason?: string): Promise<Quotation> => {
    const response = await api.post<Quotation>(`/rfq/quotations/${quotationId}/reject`, { reason });
    return response.data;
  },

  // Get RFQ messages
  getMessages: async (rfqId: string): Promise<RFQMessage[]> => {
    const response = await api.get<RFQMessage[]>(`/rfq/${rfqId}/messages`);
    return response.data;
  },

  // Send message
  sendMessage: async (rfqId: string, message: string, attachments?: string[]): Promise<RFQMessage> => {
    const response = await api.post<RFQMessage>(`/rfq/${rfqId}/messages`, {
      message,
      attachments,
    });
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (file: File): Promise<{ url: string }> => {
    const response = await api.upload<{ url: string }>('/rfq/attachments', file);
    return response.data;
  },
};

export default rfqAPI;
