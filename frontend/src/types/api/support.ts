import { 
  ApiResponse, 
  BaseEntity, 
  BaseFilter,
  PaginatedResponse 
} from './common';

// ================================
// SUPPORT ENTITY TYPES
// ================================

export enum SupportTicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_CUSTOMER = 'waiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum SupportTicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum SupportCategory {
  ORDER = 'order',
  PAYMENT = 'payment',
  PRODUCT = 'product',
  ACCOUNT = 'account',
  TECHNICAL = 'technical',
  OTHER = 'other'
}

export interface SupportTicketAttachment {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface TicketEscalation {
  isEscalated: boolean;
  escalatedAt: string;
  escalatedBy: string;
  escalationReason: string;
}

export interface SupportTicket extends BaseEntity {
  id: string;
  ticketNumber: string;
  customerId: string;
  assignedToId?: string;
  subject: string;
  description: string;
  category: SupportCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  orderId?: string;
  attachments?: SupportTicketAttachment[];
  firstResponseAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  resolution?: string;
  customerRating?: number;
  customerFeedback?: string;
  escalation?: TicketEscalation;
  internalNotes?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  messages?: TicketMessage[];
  messageCount?: number;
  lastMessageAt?: Date;
}

export interface TicketMessage extends BaseEntity {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: string;
  message: string;
  isInternal: boolean;
  attachments?: {
    id: string;
    filename: string;
    url: string;
  }[];
  readAt?: Date;
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface KnowledgeBaseArticle extends BaseEntity {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  authorId: string;
  views: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  author?: {
    id: string;
    name: string;
  };
}

export interface FAQ extends BaseEntity {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  views: number;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  updatedBy?: string;
}

export interface LiveChatSession {
  id: string;
  customerId: string;
  staffId?: string;
  subject: string;
  status: 'waiting' | 'active' | 'ended';
  startedAt: Date;
  endedAt?: Date;
  messages: {
    id: string;
    senderId: string;
    senderRole: string;
    message: string;
    sentAt: Date;
  }[];
}

// ================================
// REQUEST/RESPONSE TYPES
// ================================

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: SupportCategory;
  priority: SupportTicketPriority;
  orderId?: string;
}

export interface CreateTicketResponse {
  ticket: SupportTicket;
  message: string;
}

export interface GetTicketsResponse {
  tickets: PaginatedResponse<SupportTicket>;
}

export interface GetTicketResponse {
  ticket: SupportTicket;
}

export interface AssignTicketRequest {
  assignedToId: string;
  notes?: string;
}

export interface AssignTicketResponse {
  ticket: SupportTicket;
  message: string;
}

export interface UpdateTicketStatusRequest {
  status: SupportTicketStatus;
  resolution?: string;
  internalNotes?: string;
}

export interface UpdateTicketStatusResponse {
  ticket: SupportTicket;
  message: string;
}

export interface EscalateTicketRequest {
  reason: string;
  escalateToId?: string;
}

export interface EscalateTicketResponse {
  ticket: SupportTicket;
  message: string;
}

export interface SendMessageRequest {
  message: string;
  isInternal?: boolean;
}

export interface SendMessageResponse {
  message: TicketMessage;
  ticket: SupportTicket;
}

export interface GetMessagesResponse {
  messages: TicketMessage[];
}

export interface SubmitFeedbackRequest {
  rating: number;
  feedback: string;
}

export interface SubmitFeedbackResponse {
  ticket: SupportTicket;
  message: string;
}

export interface CreateKnowledgeBaseArticleRequest {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

export interface CreateKnowledgeBaseArticleResponse {
  article: KnowledgeBaseArticle;
  message: string;
}

export interface GetKnowledgeBaseArticlesResponse {
  articles: KnowledgeBaseArticle[];
}

export interface GetFAQResponse {
  faqs: FAQ[];
}

export interface InitiateLiveChatRequest {
  subject: string;
  initialMessage: string;
}

export interface InitiateLiveChatResponse {
  session: LiveChatSession;
  message: string;
}

export interface CreateResponseTemplateRequest {
  name: string;
  category: string;
  content: string;
  isActive: boolean;
}

export interface CreateResponseTemplateResponse {
  template: ResponseTemplate;
  message: string;
}

export interface GetResponseTemplatesResponse {
  templates: ResponseTemplate[];
}

export interface SupportAnalytics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  ticketsByCategory: {
    category: string;
    count: number;
  }[];
  ticketsByPriority: {
    priority: string;
    count: number;
  }[];
  dailyStats: {
    date: string;
    created: number;
    resolved: number;
  }[];
}

export interface SupportPerformance {
  staffId?: string;
  staffName?: string;
  assignedTickets: number;
  resolvedTickets: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  customerRating: number;
  productivityScore: number;
}

export interface SupportDashboardStats {
  totalTickets: number;
  openTickets: number;
  urgentTickets: number;
  overdueTickets: number;
  todayCreated: number;
  todayResolved: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  activeChats: number;
  knowledgeBaseViews: number;
}

export interface SLAReport {
  period: string;
  totalTickets: number;
  slaCompliance: number;
  averageFirstResponseTime: number;
  averageResolutionTime: number;
  breachedTickets: number;
  byPriority: {
    priority: string;
    tickets: number;
    compliance: number;
    avgResolutionTime: number;
  }[];
}

// ================================
// FILTER TYPES
// ================================

export interface SupportTicketFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: SupportTicketStatus | SupportTicketStatus[];
  priority?: SupportTicketPriority | SupportTicketPriority[];
  category?: SupportCategory | SupportCategory[];
  assignedTo?: string;
  customerId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  isOverdue?: boolean;
}

export interface KnowledgeBaseFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  search?: string;
  authorId?: string;
}

// ================================
// SUPPORT API INTERFACE
// ================================

export interface SupportAPI {
  // Ticket Management
  getAllTickets(filter?: SupportTicketFilter): Promise<ApiResponse<GetTicketsResponse>>;
  getMyTickets(filter?: Partial<SupportTicketFilter>): Promise<ApiResponse<GetTicketsResponse>>;
  getAssignedTickets(filter?: Partial<SupportTicketFilter>): Promise<ApiResponse<GetTicketsResponse>>;
  createTicket(request: CreateTicketRequest, attachments?: File[]): Promise<ApiResponse<CreateTicketResponse>>;
  getTicketById(id: string): Promise<ApiResponse<GetTicketResponse>>;
  assignTicket(ticketId: string, request: AssignTicketRequest): Promise<ApiResponse<AssignTicketResponse>>;
  updateTicketStatus(ticketId: string, request: UpdateTicketStatusRequest): Promise<ApiResponse<UpdateTicketStatusResponse>>;
  escalateTicket(ticketId: string, request: EscalateTicketRequest): Promise<ApiResponse<EscalateTicketResponse>>;
  
  // Ticket Messages
  sendTicketMessage(ticketId: string, request: SendMessageRequest, attachments?: File[]): Promise<ApiResponse<SendMessageResponse>>;
  getTicketMessages(ticketId: string): Promise<ApiResponse<GetMessagesResponse>>;
  
  // Customer Feedback
  submitTicketFeedback(ticketId: string, request: SubmitFeedbackRequest): Promise<ApiResponse<SubmitFeedbackResponse>>;
  
  // Knowledge Base
  getKnowledgeBaseArticles(category?: string, search?: string): Promise<ApiResponse<GetKnowledgeBaseArticlesResponse>>;
  createKnowledgeBaseArticle(request: CreateKnowledgeBaseArticleRequest): Promise<ApiResponse<CreateKnowledgeBaseArticleResponse>>;
  
  // FAQ
  getFAQ(category?: string): Promise<ApiResponse<GetFAQResponse>>;
  
  // Live Chat
  initiateLiveChat(request: InitiateLiveChatRequest): Promise<ApiResponse<InitiateLiveChatResponse>>;
  
  // Templates
  getResponseTemplates(): Promise<ApiResponse<GetResponseTemplatesResponse>>;
  createResponseTemplate(request: CreateResponseTemplateRequest): Promise<ApiResponse<CreateResponseTemplateResponse>>;
  
  // Analytics & Reports
  getSupportAnalytics(period?: string): Promise<ApiResponse<SupportAnalytics>>;
  getSupportPerformance(period?: string, staffId?: string): Promise<ApiResponse<SupportPerformance>>;
  getSupportDashboardStats(): Promise<ApiResponse<SupportDashboardStats>>;
  getSLAReport(period?: string): Promise<ApiResponse<SLAReport>>;
  
  // Admin Operations
  getSupportCategories(): Promise<ApiResponse<{ categories: string[] }>>;
}