// Customer Support and Ticket Management API Service
// Comprehensive ticket management with messaging, assignment, and knowledge base

export interface SupportTicket {
  id: number;
  ticketNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: 'shipping' | 'returns' | 'payment' | 'general' | 'technical' | 'billing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'escalated';
  createdAt: string;
  updatedAt: string;
  lastUpdated: string;
  assignedTo?: string;
  assignedToId?: number;
  resolutionDate?: string;
  resolutionTime?: number; // in minutes
  satisfactionRating?: number; // 1-5
  tags: string[];
  attachments: string[];
  messagesCount: number;
  isEscalated: boolean;
  escalationReason?: string;
  sourceChannel: 'email' | 'chat' | 'phone' | 'form' | 'social';
  relatedOrderId?: number;
  internalNotes?: string;
}

export interface CreateTicketDto {
  customerId: number;
  subject: string;
  description: string;
  category: SupportTicket['category'];
  priority: SupportTicket['priority'];
  sourceChannel: SupportTicket['sourceChannel'];
  tags?: string[];
  attachments?: string[];
  relatedOrderId?: number;
}

export interface UpdateTicketDto {
  subject?: string;
  description?: string;
  category?: SupportTicket['category'];
  priority?: SupportTicket['priority'];
  status?: SupportTicket['status'];
  assignedToId?: number;
  tags?: string[];
  satisfactionRating?: number;
  internalNotes?: string;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  senderId: number;
  senderName: string;
  senderType: 'customer' | 'agent' | 'system';
  message: string;
  messageType: 'text' | 'file' | 'system' | 'note';
  attachments: string[];
  isInternal: boolean;
  sentAt: string;
  readAt?: string;
  isRead: boolean;
}

export interface CreateMessageDto {
  ticketId: number;
  message: string;
  messageType?: TicketMessage['messageType'];
  attachments?: string[];
  isInternal?: boolean;
}

export interface TicketFilters {
  status?: SupportTicket['status'][];
  category?: SupportTicket['category'][];
  priority?: SupportTicket['priority'][];
  assignedToId?: number[];
  customerId?: number;
  createdFrom?: string;
  createdTo?: string;
  tags?: string[];
  sourceChannel?: SupportTicket['sourceChannel'][];
  searchTerm?: string;
  isEscalated?: boolean;
  hasSatisfactionRating?: boolean;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  escalatedTickets: number;
  avgResolutionTime: number; // in hours
  avgResponseTime: number; // in hours
  resolutionRate: number; // percentage
  satisfactionScore: number; // average rating
  ticketsByCategory: Record<SupportTicket['category'], number>;
  ticketsByPriority: Record<SupportTicket['priority'], number>;
  agentPerformance: {
    agentId: number;
    agentName: string;
    assignedTickets: number;
    resolvedTickets: number;
    avgResolutionTime: number;
    satisfactionScore: number;
  }[];
  trendsData: {
    date: string;
    ticketsCreated: number;
    ticketsResolved: number;
    satisfactionScore: number;
  }[];
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  helpfulCount: number;
  relatedArticles: number[];
}

export interface CreateArticleDto {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface TicketAssignment {
  ticketId: number;
  agentId: number;
  agentName: string;
  assignedAt: string;
  assignedBy: number;
  assignmentReason?: string;
}

export interface EscalationRule {
  id: number;
  name: string;
  conditions: {
    priority?: SupportTicket['priority'][];
    category?: SupportTicket['category'][];
    timeThreshold?: number; // in hours
    unassignedTime?: number; // in hours
  };
  actions: {
    escalateTo?: number; // agent ID
    changePriority?: SupportTicket['priority'];
    addTags?: string[];
    sendNotification?: boolean;
  };
  isActive: boolean;
}

export interface ChatSession {
  id: number;
  customerId: number;
  agentId?: number;
  status: 'waiting' | 'active' | 'ended';
  startedAt: string;
  endedAt?: string;
  messages: ChatMessage[];
  satisfactionRating?: number;
  tags: string[];
}

export interface ChatMessage {
  id: number;
  sessionId: number;
  senderId: number;
  senderType: 'customer' | 'agent' | 'bot';
  message: string;
  messageType: 'text' | 'file' | 'system';
  sentAt: string;
  isRead: boolean;
}

class SupportAPI {
  private baseUrl = 'https://groow-api-db.destinpq.com/api';

  // Ticket Management
  async getTickets(filters?: TicketFilters): Promise<{ tickets: SupportTicket[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/support/tickets?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  }

  async getTicketById(id: number): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  }

  async createTicket(ticketData: CreateTicketDto): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async updateTicket(id: number, updates: UpdateTicketDto): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }

  async deleteTicket(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/tickets/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }

  async assignTicket(ticketId: number, agentId: number, reason?: string): Promise<TicketAssignment> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, reason }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      throw error;
    }
  }

  async escalateTicket(ticketId: number, reason: string, escalateTo?: number): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, escalateTo }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error escalating ticket:', error);
      throw error;
    }
  }

  async resolveTicket(ticketId: number, resolutionNotes: string): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionNotes }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error resolving ticket:', error);
      throw error;
    }
  }

  async closeTicket(ticketId: number): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/close`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Error closing ticket:', error);
      throw error;
    }
  }

  async reopenTicket(ticketId: number, reason: string): Promise<SupportTicket> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error reopening ticket:', error);
      throw error;
    }
  }

  // Message Management
  async getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/messages`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
      throw error;
    }
  }

  async addTicketMessage(messageData: CreateMessageDto): Promise<TicketMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/support/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding ticket message:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/messages/${messageId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Statistics and Analytics
  async getSupportStats(dateRange?: { from: string; to: string }): Promise<SupportStats> {
    try {
      const queryParams = new URLSearchParams();
      if (dateRange) {
        queryParams.append('from', dateRange.from);
        queryParams.append('to', dateRange.to);
      }

      const response = await fetch(`${this.baseUrl}/support/stats?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching support stats:', error);
      throw error;
    }
  }

  async getAgentWorkload(): Promise<{ agentId: number; agentName: string; activeTickets: number; todayTickets: number }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/agents/workload`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching agent workload:', error);
      throw error;
    }
  }

  // Knowledge Base
  async getKnowledgeBaseArticles(category?: string, searchTerm?: string): Promise<KnowledgeBaseArticle[]> {
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(`${this.baseUrl}/support/knowledge-base?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge base articles:', error);
      throw error;
    }
  }

  async getKnowledgeBaseArticle(id: number): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(`${this.baseUrl}/support/knowledge-base/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching knowledge base article:', error);
      throw error;
    }
  }

  async createKnowledgeBaseArticle(articleData: CreateArticleDto): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(`${this.baseUrl}/support/knowledge-base`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating knowledge base article:', error);
      throw error;
    }
  }

  async updateKnowledgeBaseArticle(id: number, updates: UpdateArticleDto): Promise<KnowledgeBaseArticle> {
    try {
      const response = await fetch(`${this.baseUrl}/support/knowledge-base/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating knowledge base article:', error);
      throw error;
    }
  }

  async deleteKnowledgeBaseArticle(id: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/knowledge-base/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting knowledge base article:', error);
      throw error;
    }
  }

  // Live Chat Management
  async getChatSessions(status?: ChatSession['status']): Promise<ChatSession[]> {
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);

      const response = await fetch(`${this.baseUrl}/support/chat/sessions?${queryParams}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  async startChatSession(customerId: number): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw error;
    }
  }

  async joinChatSession(sessionId: number, agentId: number): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/sessions/${sessionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error joining chat session:', error);
      throw error;
    }
  }

  async endChatSession(sessionId: number): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/sessions/${sessionId}/end`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw error;
    }
  }

  async sendChatMessage(sessionId: number, message: string, senderId: number, senderType: ChatMessage['senderType']): Promise<ChatMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/support/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message, senderId, senderType }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdateTickets(ticketIds: number[], updates: Partial<UpdateTicketDto>): Promise<SupportTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/bulk-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds, updates }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error bulk updating tickets:', error);
      throw error;
    }
  }

  async bulkAssignTickets(ticketIds: number[], agentId: number): Promise<TicketAssignment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/bulk-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds, agentId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error bulk assigning tickets:', error);
      throw error;
    }
  }

  async bulkDeleteTickets(ticketIds: number[]): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/support/tickets/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketIds }),
      });
    } catch (error) {
      console.error('Error bulk deleting tickets:', error);
      throw error;
    }
  }

  // Export and Reporting
  async exportTickets(filters?: TicketFilters, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(`${key}[]`, v.toString()));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/support/tickets/export?${queryParams}`);
      return await response.blob();
    } catch (error) {
      console.error('Error exporting tickets:', error);
      throw error;
    }
  }

  async generateSupportReport(type: 'performance' | 'satisfaction' | 'trends', dateRange: { from: string; to: string }): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/support/reports/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      });
      return await response.blob();
    } catch (error) {
      console.error('Error generating support report:', error);
      throw error;
    }
  }

  // Search and Suggestions
  async searchTickets(searchTerm: string, filters?: Partial<TicketFilters>): Promise<SupportTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, filters }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error searching tickets:', error);
      throw error;
    }
  }

  async getSuggestedResponses(ticketId: number): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/suggestions`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggested responses:', error);
      throw error;
    }
  }

  async getSimilarTickets(ticketId: number): Promise<SupportTicket[]> {
    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/similar`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching similar tickets:', error);
      throw error;
    }
  }
}

export const supportAPI = new SupportAPI();
export default supportAPI;