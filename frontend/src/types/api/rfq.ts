import { 
  ApiResponse, 
  BaseEntity, 
  PaginatedResponse 
} from './common';

// ================================
// RFQ ENTITY TYPES  
// ================================

export enum RfqStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  QUOTED = 'quoted',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum QuotationStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface RfqItem {
  productId: string;
  quantity: number;
  specifications?: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    category: string;
    brand?: string;
    currentPrice: number;
  };
}

export interface Rfq extends BaseEntity {
  id: string;
  rfqNumber: string;
  customerId: string;
  title: string;
  description: string;
  items: RfqItem[];
  targetPrice?: string;
  deliveryLocation?: string;
  requiredBy?: string;
  attachments?: string[];
  status: RfqStatus;
  closedAt?: Date;
  customer?: {
    id: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
  quotations?: Quotation[];
  quotationCount?: number;
  lowestQuotation?: number;
  highestQuotation?: number;
  averageQuotation?: number;
}

export interface QuotationItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Quotation extends BaseEntity {
  id: string;
  rfqId: string;
  vendorId: string;
  totalPrice: number;
  items: QuotationItem[];
  notes?: string;
  validityDays?: number;
  expiresAt?: Date;
  status: QuotationStatus;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  vendor?: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone?: string;
    rating?: number;
  };
  rfq?: {
    id: string;
    rfqNumber: string;
    title: string;
    customerId: string;
  };
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface CreateRfqItemRequest {
  productId: string;
  quantity: number;
  specifications?: string;
}

export interface CreateRfqRequest {
  title: string;
  description: string;
  items: CreateRfqItemRequest[];
  targetPrice?: string;
  deliveryLocation?: string;
  requiredBy?: string;
}

export interface CreateRfqResponse {
  rfq: Rfq;
  message: string;
}

export interface GetRfqsResponse {
  rfqs: PaginatedResponse<Rfq>;
}

export interface GetRfqResponse {
  rfq: Rfq;
}

export interface UpdateRfqStatusRequest {
  status: RfqStatus;
  reason?: string;
}

export interface UpdateRfqStatusResponse {
  rfq: Rfq;
  message: string;
}

export interface CreateQuotationItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CreateQuotationRequest {
  rfqId: string;
  totalPrice: number;
  items: CreateQuotationItemRequest[];
  notes?: string;
  validityDays?: number;
}

export interface CreateQuotationResponse {
  quotation: Quotation;
  message: string;
}

export interface GetQuotationsResponse {
  quotations: Quotation[];
  rfqDetails?: {
    id: string;
    rfqNumber: string;
    title: string;
    status: RfqStatus;
  };
}

export interface GetQuotationResponse {
  quotation: Quotation;
}

export interface AcceptQuotationResponse {
  quotation: Quotation;
  rfq: Rfq;
  order?: {
    id: string;
    orderNumber: string;
  };
  message: string;
}

export interface RejectQuotationRequest {
  reason: string;
}

export interface RejectQuotationResponse {
  quotation: Quotation;
  message: string;
}

export interface RfqAnalytics {
  totalRfqs: number;
  openRfqs: number;
  quotedRfqs: number;
  acceptedRfqs: number;
  averageQuotationTime: number;
  averageAcceptanceRate: number;
  topCategories: {
    category: string;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    created: number;
    quoted: number;
    accepted: number;
  }[];
}

export interface VendorQuotationStats {
  vendorId: string;
  vendorName: string;
  totalQuotations: number;
  acceptedQuotations: number;
  acceptanceRate: number;
  averageResponseTime: number;
  averageQuotationValue: number;
  topCategories: string[];
}

// ================================
// FILTER TYPES
// ================================

export interface RfqFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: RfqStatus | RfqStatus[];
  customerId?: string;
  category?: string;
  minTargetPrice?: number;
  maxTargetPrice?: number;
  requiredByFrom?: Date;
  requiredByTo?: Date;
  createdFrom?: Date;
  createdTo?: Date;
  search?: string;
  hasQuotations?: boolean;
}

export interface QuotationFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: QuotationStatus | QuotationStatus[];
  vendorId?: string;
  rfqId?: string;
  minPrice?: number;
  maxPrice?: number;
  expiringWithin?: number; // days
  createdFrom?: Date;
  createdTo?: Date;
}

// ================================
// RFQ API INTERFACE
// ================================

export interface RfqAPI {
  // RFQ Management
  createRfq(request: CreateRfqRequest, attachments?: File[]): Promise<ApiResponse<CreateRfqResponse>>;
  getAllRfqs(filter?: RfqFilter): Promise<ApiResponse<GetRfqsResponse>>;
  getMyRfqs(filter?: Partial<RfqFilter>): Promise<ApiResponse<GetRfqsResponse>>;
  getRfqById(id: string): Promise<ApiResponse<GetRfqResponse>>;
  updateRfqStatus(id: string, request: UpdateRfqStatusRequest): Promise<ApiResponse<UpdateRfqStatusResponse>>;
  deleteRfq(id: string): Promise<ApiResponse<{ message: string }>>;
  
  // RFQ Quotations
  getQuotations(rfqId: string): Promise<ApiResponse<GetQuotationsResponse>>;
  
  // Quotation Management (Vendor)
  createQuotation(request: CreateQuotationRequest): Promise<ApiResponse<CreateQuotationResponse>>;
  getMyQuotations(filter?: QuotationFilter): Promise<ApiResponse<{ quotations: PaginatedResponse<Quotation> }>>;
  updateQuotation(quotationId: string, request: Partial<CreateQuotationRequest>): Promise<ApiResponse<CreateQuotationResponse>>;
  withdrawQuotation(quotationId: string): Promise<ApiResponse<{ message: string }>>;
  
  // Quotation Actions (Customer)
  acceptQuotation(quotationId: string): Promise<ApiResponse<AcceptQuotationResponse>>;
  rejectQuotation(quotationId: string, request: RejectQuotationRequest): Promise<ApiResponse<RejectQuotationResponse>>;
  
  // Analytics & Reports
  getRfqAnalytics(period?: string): Promise<ApiResponse<RfqAnalytics>>;
  getVendorQuotationStats(vendorId?: string): Promise<ApiResponse<VendorQuotationStats[]>>;
  
  // Admin Operations
  getAllQuotations(filter?: QuotationFilter): Promise<ApiResponse<{ quotations: PaginatedResponse<Quotation> }>>;
  getRfqCategories(): Promise<ApiResponse<{ categories: string[] }>>;
  getExpiredQuotations(): Promise<ApiResponse<{ quotations: Quotation[] }>>;
}