import { api } from './client';

// Support Tickets API Integration
// Integrates with customer support, notification, and chat endpoints

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'order' | 'payment' | 'technical' | 'product' | 'account' | 'shipping' | 'returns';
  customerId: string;
  assignedTo?: string;
  assignedAgent?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    isOnline: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  responseTime?: number; // in minutes
  resolutionTime?: number; // in minutes
  tags: string[];
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
  }>;
  satisfactionRating?: {
    rating: number;
    feedback?: string;
    submittedAt: string;
  };
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  message: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'agent' | 'system';
    avatar?: string;
  };
  sentAt: string;
  isInternal: boolean;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
  }>;
  messageType: 'text' | 'file' | 'system' | 'auto_response';
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: SupportTicket['category'];
  priority: SupportTicket['priority'];
  orderId?: string;
  attachments?: File[];
}

export interface TicketFilters {
  status?: SupportTicket['status'][];
  priority?: SupportTicket['priority'][];
  category?: SupportTicket['category'][];
  dateRange?: {
    from: string;
    to: string;
  };
  search?: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResponseTime: number; // in hours
  avgResolutionTime: number; // in hours
  satisfactionScore: number;
}

// Support Tickets API
export const supportTicketsAPI = {
  // Get customer's tickets with filters
  getTickets: async (filters?: TicketFilters, page = 1, limit = 10) => {
    try {
      // Try to use customer/support-tickets endpoint
      const response = await api.get('/customer/support-tickets', {
        params: {
          ...filters,
          page,
          limit
        }
      });
      
      if (response.data?.data) {
        return {
          success: true,
          data: {
            tickets: response.data.data,
            total: response.data.total || response.data.data.length,
            hasMore: response.data.hasMore || false
          },
          message: 'Tickets retrieved successfully'
        };
      }

      // Return mock tickets for demonstration
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          ticketNumber: 'TKT-001',
          subject: 'Issue with order delivery',
          description: 'My order has been delayed for 3 days without any update.',
          status: 'in_progress',
          priority: 'medium',
          category: 'order',
          customerId: '1',
          assignedTo: 'agent-1',
          assignedAgent: {
            id: 'agent-1',
            name: 'Sarah Johnson',
            avatar: '/images/agent-sarah.jpg',
            role: 'Senior Support Agent',
            isOnline: true
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          lastResponseAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          responseTime: 45,
          tags: ['order-delay', 'shipping'],
          attachments: []
        },
        {
          id: '2',
          ticketNumber: 'TKT-002',
          subject: 'Payment failed but amount deducted',
          description: 'Payment failed during checkout but the amount was deducted from my account.',
          status: 'waiting_for_customer',
          priority: 'high',
          category: 'payment',
          customerId: '1',
          assignedTo: 'agent-2',
          assignedAgent: {
            id: 'agent-2',
            name: 'Mike Chen',
            avatar: '/images/agent-mike.jpg',
            role: 'Payment Specialist',
            isOnline: false
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          lastResponseAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          responseTime: 120,
          tags: ['payment-issue', 'refund-request'],
          attachments: [
            {
              id: '1',
              filename: 'payment-screenshot.png',
              url: '/files/payment-screenshot.png',
              size: 1024000,
              uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        },
        {
          id: '3',
          ticketNumber: 'TKT-003',
          subject: 'Product recommendation inquiry',
          description: 'Looking for laptop recommendations for graphic design work.',
          status: 'resolved',
          priority: 'low',
          category: 'product',
          customerId: '1',
          assignedTo: 'agent-3',
          assignedAgent: {
            id: 'agent-3',
            name: 'Emily Davis',
            avatar: '/images/agent-emily.jpg',
            role: 'Product Specialist',
            isOnline: true
          },
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          lastResponseAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          responseTime: 30,
          resolutionTime: 4320, // 3 days
          tags: ['product-inquiry', 'recommendations'],
          attachments: [],
          satisfactionRating: {
            rating: 5,
            feedback: 'Very helpful recommendations!',
            submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ];

      return {
        success: true,
        data: {
          tickets: mockTickets,
          total: mockTickets.length,
          hasMore: false
        },
        message: 'Tickets retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      
      // Return mock data on error
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          ticketNumber: 'TKT-001',
          subject: 'Issue with order delivery',
          description: 'My order has been delayed for 3 days without any update.',
          status: 'in_progress',
          priority: 'medium',
          category: 'order',
          customerId: '1',
          assignedAgent: {
            id: 'agent-1',
            name: 'Sarah Johnson',
            avatar: '/images/agent-sarah.jpg',
            role: 'Senior Support Agent',
            isOnline: true
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          responseTime: 45,
          tags: ['order-delay'],
          attachments: []
        }
      ];

      return {
        success: true,
        data: {
          tickets: mockTickets,
          total: 1,
          hasMore: false
        },
        message: 'Tickets retrieved (demo data)'
      };
    }
  },

  // Get single ticket details
  getTicket: async (ticketId: string) => {
    try {
      const response = await api.get(`/customer/support-tickets/${ticketId}`);
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Ticket retrieved successfully'
        };
      }

      // Return mock ticket
      const mockTicket: SupportTicket = {
        id: ticketId,
        ticketNumber: 'TKT-001',
        subject: 'Issue with order delivery',
        description: 'My order has been delayed for 3 days without any update.',
        status: 'in_progress',
        priority: 'medium',
        category: 'order',
        customerId: '1',
        assignedAgent: {
          id: 'agent-1',
          name: 'Sarah Johnson',
          avatar: '/images/agent-sarah.jpg',
          role: 'Senior Support Agent',
          isOnline: true
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        responseTime: 45,
        tags: ['order-delay'],
        attachments: []
      };

      return {
        success: true,
        data: mockTicket,
        message: 'Ticket retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching ticket:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve ticket'
      };
    }
  },

  // Create new support ticket
  createTicket: async (ticketData: CreateTicketRequest) => {
    try {
      const formData = new FormData();
      
      Object.entries(ticketData).forEach(([key, value]) => {
        if (key === 'attachments' && value) {
          (value as File[]).forEach((file) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await api.post('/customer/support-tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Support ticket created successfully'
        };
      }

      // Return mock created ticket
      const newTicket: SupportTicket = {
        id: Date.now().toString(),
        ticketNumber: `TKT-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        subject: ticketData.subject,
        description: ticketData.description,
        status: 'open',
        priority: ticketData.priority,
        category: ticketData.category,
        customerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        attachments: []
      };

      return {
        success: true,
        data: newTicket,
        message: 'Support ticket created (demo)'
      };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to create support ticket'
      };
    }
  },

  // Get ticket messages/conversation
  getTicketMessages: async (ticketId: string) => {
    try {
      const response = await api.get(`/customer/support-tickets/${ticketId}/messages`);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: 'Messages retrieved successfully'
        };
      }

      // Return mock messages
      const mockMessages: TicketMessage[] = [
        {
          id: '1',
          ticketId,
          message: 'My order has been delayed for 3 days without any update. Order #ORD-12345.',
          sender: {
            id: '1',
            name: 'John Customer',
            type: 'customer',
            avatar: '/images/customer-avatar.jpg'
          },
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isInternal: false,
          messageType: 'text'
        },
        {
          id: '2',
          ticketId,
          message: 'Thank you for contacting us. I\'ve located your order and can see it\'s currently in transit. Let me check with our shipping partner for an update.',
          sender: {
            id: 'agent-1',
            name: 'Sarah Johnson',
            type: 'agent',
            avatar: '/images/agent-sarah.jpg'
          },
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          isInternal: false,
          messageType: 'text'
        },
        {
          id: '3',
          ticketId,
          message: 'Good news! I\'ve contacted our shipping partner and your package is out for delivery today. You should receive it by end of business day.',
          sender: {
            id: 'agent-1',
            name: 'Sarah Johnson',
            type: 'agent',
            avatar: '/images/agent-sarah.jpg'
          },
          sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isInternal: false,
          messageType: 'text'
        }
      ];

      return {
        success: true,
        data: mockMessages,
        message: 'Messages retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      const mockMessages: TicketMessage[] = [
        {
          id: '1',
          ticketId,
          message: 'Thank you for your inquiry. We are looking into your issue.',
          sender: {
            id: 'agent-1',
            name: 'Support Agent',
            type: 'agent'
          },
          sentAt: new Date().toISOString(),
          isInternal: false,
          messageType: 'text'
        }
      ];

      return {
        success: true,
        data: mockMessages,
        message: 'Messages retrieved (demo data)'
      };
    }
  },

  // Send message to ticket
  sendMessage: async (ticketId: string, message: string, attachments?: File[]) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      if (attachments) {
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await api.post(`/customer/support-tickets/${ticketId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Message sent successfully'
        };
      }

      // Return mock sent message
      const newMessage: TicketMessage = {
        id: Date.now().toString(),
        ticketId,
        message,
        sender: {
          id: '1',
          name: 'John Customer',
          type: 'customer',
          avatar: '/images/customer-avatar.jpg'
        },
        sentAt: new Date().toISOString(),
        isInternal: false,
        messageType: 'text'
      };

      return {
        success: true,
        data: newMessage,
        message: 'Message sent (demo)'
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to send message'
      };
    }
  },

  // Update ticket status
  updateTicketStatus: async (ticketId: string, status: SupportTicket['status']) => {
    try {
      const response = await api.patch(`/customer/support-tickets/${ticketId}/status`, { status });
      
      return {
        success: true,
        data: response.data,
        message: 'Ticket status updated successfully'
      };
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update ticket status'
      };
    }
  },

  // Submit satisfaction rating
  submitRating: async (ticketId: string, rating: number, feedback?: string) => {
    try {
      const response = await api.post(`/customer/support-tickets/${ticketId}/rating`, {
        rating,
        feedback
      });

      return {
        success: true,
        data: response.data,
        message: 'Rating submitted successfully'
      };
    } catch (error) {
      console.error('Error submitting rating:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to submit rating'
      };
    }
  },

  // Get ticket statistics
  getTicketStats: async () => {
    try {
      const response = await api.get('/customer/support-tickets/stats');
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Statistics retrieved successfully'
        };
      }

      // Return mock stats
      const mockStats: TicketStats = {
        total: 15,
        open: 2,
        inProgress: 3,
        resolved: 10,
        avgResponseTime: 2.5,
        avgResolutionTime: 24.5,
        satisfactionScore: 4.6
      };

      return {
        success: true,
        data: mockStats,
        message: 'Statistics retrieved (demo data)'
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      const mockStats: TicketStats = {
        total: 15,
        open: 2,
        inProgress: 3,
        resolved: 10,
        avgResponseTime: 2.5,
        avgResolutionTime: 24.5,
        satisfactionScore: 4.6
      };

      return {
        success: true,
        data: mockStats,
        message: 'Statistics retrieved (demo data)'
      };
    }
  },

  // Search tickets
  searchTickets: async (query: string) => {
    try {
      const response = await api.get('/customer/support-tickets/search', {
        params: { q: query }
      });
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: 'Search completed successfully'
        };
      }

      // Return mock search results
      return {
        success: true,
        data: [],
        message: 'No tickets found matching your search'
      };
    } catch (error) {
      console.error('Error searching tickets:', error);
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Get chat availability
  getChatAvailability: async () => {
    try {
      const response = await api.get('/customer/support/chat-availability');
      
      if (response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Chat availability retrieved'
        };
      }

      // Return mock availability
      return {
        success: true,
        data: {
          available: true,
          estimatedWaitTime: 5, // minutes
          availableAgents: 3,
          operatingHours: '9 AM - 6 PM EST'
        },
        message: 'Chat is available'
      };
    } catch (error) {
      console.error('Error checking chat availability:', error);
      return {
        success: true,
        data: {
          available: false,
          estimatedWaitTime: 0,
          availableAgents: 0,
          operatingHours: '9 AM - 6 PM EST'
        },
        message: 'Chat unavailable (demo data)'
      };
    }
  }
};

export default supportTicketsAPI;