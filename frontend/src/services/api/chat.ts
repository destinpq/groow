import api from './client';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'vendor';
  text: string;
  attachments?: string[];
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  status: 'active' | 'archived';
  productContext?: {
    productId: string;
    productName: string;
  };
  createdAt: string;
}

export interface SendMessageData {
  conversationId: string;
  text: string;
  attachments?: string[];
}

export interface CreateConversationData {
  vendorId: string;
  productId?: string;
  initialMessage?: string;
}

// Chat API Service
export const chatAPI = {
  // Get all conversations for current user
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/chat/conversations');
    return response.data;
  },

  // Get a specific conversation
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  // Create a new conversation
  createConversation: async (data: CreateConversationData): Promise<Conversation> => {
    const response = await api.post<Conversation>('/chat/conversations', data);
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (conversationId: string, page: number = 1, limit: number = 50): Promise<{
    data: Message[];
    total: number;
    page: number;
  }> => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Send a message
  sendMessage: async (data: SendMessageData): Promise<Message> => {
    const response = await api.post<Message>('/chat/messages', data);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<void> => {
    await api.patch(`/chat/conversations/${conversationId}/read`);
  },

  // Archive conversation
  archiveConversation: async (conversationId: string): Promise<void> => {
    await api.patch(`/chat/conversations/${conversationId}/archive`);
  },

  // Delete conversation
  deleteConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/chat/conversations/${conversationId}`);
  },

  // Get unread message count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/chat/unread-count');
    return response.data.count;
  },
};

export default chatAPI;
