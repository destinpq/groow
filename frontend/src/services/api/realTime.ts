/**
 * Real-Time API Services
 * WebSocket and real-time communication functionality
 */
import { api } from './client';

export interface WebSocketConnection {
  id: string;
  userId?: string;
  deviceId?: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  connectedAt: string;
  lastPingAt: string;
  subscriptions: string[];
  metadata: {
    userAgent: string;
    ip: string;
    country?: string;
    platform: 'web' | 'mobile' | 'desktop';
  };
}

export interface RealTimeMessage {
  id: string;
  channel: string;
  type: 'notification' | 'chat' | 'update' | 'event' | 'system';
  payload: any;
  metadata: {
    senderId?: string;
    timestamp: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    ttl?: number; // Time to live in seconds
    retryPolicy?: {
      maxRetries: number;
      backoffMultiplier: number;
    };
  };
  targeting: {
    userIds?: string[];
    deviceIds?: string[];
    channels?: string[];
    roles?: string[];
    segments?: string[];
  };
  delivery: {
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'expired';
    sentAt?: string;
    deliveredAt?: string;
    acknowledgedAt?: string;
    error?: string;
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'vendor' | 'support' | 'bot';
  content: {
    type: 'text' | 'image' | 'file' | 'location' | 'product' | 'order' | 'system';
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    productId?: string;
    orderId?: string;
    metadata?: Record<string, any>;
  };
  replyTo?: string; // ID of message being replied to
  edited: boolean;
  editedAt?: string;
  reactions: Array<{
    userId: string;
    type: string; // emoji or reaction type
    timestamp: string;
  }>;
  readBy: Array<{
    userId: string;
    readAt: string;
  }>;
  mentions: Array<{
    userId: string;
    displayName: string;
    position: {
      start: number;
      length: number;
    };
  }>;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support' | 'vendor_chat' | 'broadcast';
  participants: Array<{
    userId: string;
    role: 'customer' | 'vendor' | 'support' | 'admin' | 'bot';
    joinedAt: string;
    leftAt?: string;
    permissions: string[];
    metadata?: Record<string, any>;
  }>;
  metadata: {
    title?: string;
    description?: string;
    avatar?: string;
    tags: string[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
    category?: string;
    relatedOrderId?: string;
    relatedProductId?: string;
    autoAssignRules?: Record<string, any>;
  };
  settings: {
    allowJoin: boolean;
    allowInvite: boolean;
    allowFileSharing: boolean;
    allowVoiceCall: boolean;
    allowVideoCall: boolean;
    retentionDays?: number;
    moderationEnabled: boolean;
    botEnabled: boolean;
  };
  stats: {
    messageCount: number;
    participantCount: number;
    lastActivity: string;
    avgResponseTime?: number;
    resolution?: {
      status: 'open' | 'pending' | 'resolved' | 'closed';
      resolvedAt?: string;
      resolvedBy?: string;
      rating?: number;
      feedback?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface LiveNotification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'shipping' | 'promotion' | 'system' | 'chat' | 'alert';
  title: string;
  message: string;
  data: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  actions?: Array<{
    id: string;
    label: string;
    type: 'button' | 'link' | 'api_call';
    action: string;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
  expiry?: {
    expiresAt: string;
    action: 'hide' | 'mark_read' | 'delete';
  };
  delivery: {
    channels: Array<'websocket' | 'push' | 'email' | 'sms'>;
    preferences: {
      immediate: boolean;
      batched: boolean;
      quietHours: boolean;
    };
  };
  createdAt: string;
  readAt?: string;
  actionedAt?: string;
}

export interface LiveEvent {
  id: string;
  type: 'user_activity' | 'order_update' | 'inventory_change' | 'price_change' | 'system_event';
  source: string; // Service or component that generated the event
  data: Record<string, any>;
  context: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    correlationId?: string;
  };
  metadata: {
    environment: string;
    version: string;
    timestamp: string;
    ip?: string;
    userAgent?: string;
  };
  routing: {
    channels: string[];
    conditions?: Record<string, any>;
    delay?: number;
  };
}

export interface PresenceStatus {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  activity?: string; // What the user is currently doing
  location?: {
    page: string;
    section?: string;
  };
  customStatus?: {
    emoji?: string;
    text?: string;
    expiresAt?: string;
  };
  devices: Array<{
    deviceId: string;
    type: 'web' | 'mobile' | 'desktop';
    lastActive: string;
  }>;
}

export const realTimeAPI = {
  /**
   * Establish WebSocket connection
   */
  connect: async (options?: {
    channels?: string[];
    userId?: string;
    deviceId?: string;
  }): Promise<WebSocketConnection> => {
    const { data } = await api.post('/realtime/connect', options);
    return data;
  },

  /**
   * Disconnect WebSocket
   */
  disconnect: async (connectionId: string): Promise<void> => {
    await api.delete(`/realtime/connections/${connectionId}`);
  },

  /**
   * Subscribe to channels
   */
  subscribe: async (
    connectionId: string,
    channels: string[]
  ): Promise<{ subscribed: string[]; failed: string[] }> => {
    const { data } = await api.post(`/realtime/connections/${connectionId}/subscribe`, {
      channels,
    });
    return data;
  },

  /**
   * Unsubscribe from channels
   */
  unsubscribe: async (
    connectionId: string,
    channels: string[]
  ): Promise<{ unsubscribed: string[]; failed: string[] }> => {
    const { data } = await api.post(`/realtime/connections/${connectionId}/unsubscribe`, {
      channels,
    });
    return data;
  },

  /**
   * Send real-time message to channel
   */
  sendMessage: async (
    message: Omit<RealTimeMessage, 'id' | 'delivery'>
  ): Promise<RealTimeMessage> => {
    const { data } = await api.post('/realtime/messages/send', message);
    return data;
  },

  /**
   * Send message to specific users
   */
  sendDirectMessage: async (
    userIds: string[],
    message: {
      type: RealTimeMessage['type'];
      payload: any;
      priority?: RealTimeMessage['metadata']['priority'];
    }
  ): Promise<RealTimeMessage> => {
    const { data } = await api.post('/realtime/messages/direct', {
      targeting: { userIds },
      ...message,
    });
    return data;
  },

  /**
   * Broadcast message to all connected users
   */
  broadcast: async (
    message: {
      type: RealTimeMessage['type'];
      payload: any;
      priority?: RealTimeMessage['metadata']['priority'];
    }
  ): Promise<RealTimeMessage> => {
    const { data } = await api.post('/realtime/messages/broadcast', message);
    return data;
  },

  /**
   * Get message history for channel
   */
  getMessageHistory: async (
    channel: string,
    options?: {
      limit?: number;
      before?: string; // timestamp
      after?: string;
      types?: RealTimeMessage['type'][];
    }
  ): Promise<RealTimeMessage[]> => {
    const { data } = await api.get(`/realtime/channels/${channel}/history`, {
      params: options,
    });
    return data;
  },

  /**
   * Create chat conversation
   */
  createConversation: async (
    conversationData: Omit<Conversation, 'id' | 'stats' | 'createdAt' | 'updatedAt'>
  ): Promise<Conversation> => {
    const { data } = await api.post('/realtime/conversations', conversationData);
    return data;
  },

  /**
   * Get user's conversations
   */
  getConversations: async (
    userId: string,
    options?: {
      type?: Conversation['type'];
      limit?: number;
      includeArchived?: boolean;
    }
  ): Promise<Conversation[]> => {
    const { data } = await api.get(`/realtime/users/${userId}/conversations`, {
      params: options,
    });
    return data;
  },

  /**
   * Get conversation details
   */
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const { data } = await api.get(`/realtime/conversations/${conversationId}`);
    return data;
  },

  /**
   * Send chat message
   */
  sendChatMessage: async (
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'conversationId' | 'status' | 'timestamp' | 'updatedAt' | 'reactions' | 'readBy' | 'edited'>
  ): Promise<ChatMessage> => {
    const { data } = await api.post(`/realtime/conversations/${conversationId}/messages`, message);
    return data;
  },

  /**
   * Get chat messages
   */
  getChatMessages: async (
    conversationId: string,
    options?: {
      limit?: number;
      before?: string;
      after?: string;
      includeSystemMessages?: boolean;
    }
  ): Promise<ChatMessage[]> => {
    const { data } = await api.get(`/realtime/conversations/${conversationId}/messages`, {
      params: options,
    });
    return data;
  },

  /**
   * Edit chat message
   */
  editChatMessage: async (
    messageId: string,
    newContent: ChatMessage['content']
  ): Promise<ChatMessage> => {
    const { data } = await api.put(`/realtime/messages/${messageId}`, {
      content: newContent,
    });
    return data;
  },

  /**
   * Delete chat message
   */
  deleteChatMessage: async (messageId: string): Promise<void> => {
    await api.delete(`/realtime/messages/${messageId}`);
  },

  /**
   * Add reaction to message
   */
  addReaction: async (
    messageId: string,
    reactionType: string
  ): Promise<ChatMessage> => {
    const { data } = await api.post(`/realtime/messages/${messageId}/reactions`, {
      type: reactionType,
    });
    return data;
  },

  /**
   * Remove reaction from message
   */
  removeReaction: async (
    messageId: string,
    reactionType: string
  ): Promise<ChatMessage> => {
    const { data } = await api.delete(`/realtime/messages/${messageId}/reactions/${reactionType}`);
    return data;
  },

  /**
   * Mark message as read
   */
  markAsRead: async (messageId: string): Promise<void> => {
    await api.put(`/realtime/messages/${messageId}/read`);
  },

  /**
   * Mark conversation as read
   */
  markConversationAsRead: async (conversationId: string): Promise<void> => {
    await api.put(`/realtime/conversations/${conversationId}/read`);
  },

  /**
   * Join conversation
   */
  joinConversation: async (
    conversationId: string,
    userId: string
  ): Promise<Conversation> => {
    const { data } = await api.post(`/realtime/conversations/${conversationId}/join`, {
      userId,
    });
    return data;
  },

  /**
   * Leave conversation
   */
  leaveConversation: async (
    conversationId: string,
    userId: string
  ): Promise<void> => {
    await api.post(`/realtime/conversations/${conversationId}/leave`, {
      userId,
    });
  },

  /**
   * Get live notifications
   */
  getNotifications: async (
    userId: string,
    options?: {
      unreadOnly?: boolean;
      types?: LiveNotification['type'][];
      limit?: number;
      priority?: LiveNotification['priority'];
    }
  ): Promise<LiveNotification[]> => {
    const { data } = await api.get(`/realtime/users/${userId}/notifications`, {
      params: options,
    });
    return data;
  },

  /**
   * Send live notification
   */
  sendNotification: async (
    notification: Omit<LiveNotification, 'id' | 'read' | 'createdAt' | 'readAt' | 'actionedAt'>
  ): Promise<LiveNotification> => {
    const { data } = await api.post('/realtime/notifications/send', notification);
    return data;
  },

  /**
   * Mark notification as read
   */
  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.put(`/realtime/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead: async (userId: string): Promise<void> => {
    await api.put(`/realtime/users/${userId}/notifications/read-all`);
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/realtime/notifications/${notificationId}`);
  },

  /**
   * Perform notification action
   */
  performNotificationAction: async (
    notificationId: string,
    actionId: string,
    data?: Record<string, any>
  ): Promise<{ success: boolean; result?: any }> => {
    const { data: result } = await api.post(`/realtime/notifications/${notificationId}/actions/${actionId}`, data);
    return result;
  },

  /**
   * Publish live event
   */
  publishEvent: async (
    event: Omit<LiveEvent, 'id'>
  ): Promise<LiveEvent> => {
    const { data } = await api.post('/realtime/events/publish', event);
    return data;
  },

  /**
   * Subscribe to live events
   */
  subscribeToEvents: async (
    connectionId: string,
    eventTypes: string[],
    filters?: Record<string, any>
  ): Promise<{ subscribed: string[]; failed: string[] }> => {
    const { data } = await api.post(`/realtime/connections/${connectionId}/events/subscribe`, {
      eventTypes,
      filters,
    });
    return data;
  },

  /**
   * Get event history
   */
  getEventHistory: async (
    eventType?: string,
    options?: {
      from?: string;
      to?: string;
      source?: string;
      userId?: string;
      limit?: number;
    }
  ): Promise<LiveEvent[]> => {
    const { data } = await api.get('/realtime/events/history', {
      params: { eventType, ...options },
    });
    return data;
  },

  /**
   * Set user presence status
   */
  setPresence: async (
    userId: string,
    status: PresenceStatus['status'],
    options?: {
      activity?: string;
      customStatus?: PresenceStatus['customStatus'];
      location?: PresenceStatus['location'];
    }
  ): Promise<PresenceStatus> => {
    const { data } = await api.put(`/realtime/presence/${userId}`, {
      status,
      ...options,
    });
    return data;
  },

  /**
   * Get user presence
   */
  getPresence: async (userId: string): Promise<PresenceStatus> => {
    const { data } = await api.get(`/realtime/presence/${userId}`);
    return data;
  },

  /**
   * Get multiple users' presence
   */
  getBulkPresence: async (userIds: string[]): Promise<PresenceStatus[]> => {
    const { data } = await api.post('/realtime/presence/bulk', { userIds });
    return data;
  },

  /**
   * Subscribe to presence updates
   */
  subscribeToPresence: async (
    connectionId: string,
    userIds: string[]
  ): Promise<{ subscribed: string[]; failed: string[] }> => {
    const { data } = await api.post(`/realtime/connections/${connectionId}/presence/subscribe`, {
      userIds,
    });
    return data;
  },

  /**
   * Get real-time analytics
   */
  getRealTimeAnalytics: async (
    timeRange?: { from: string; to: string }
  ): Promise<{
    activeConnections: number;
    messagesPerSecond: number;
    channelStats: Record<string, {
      subscribers: number;
      messagesPerHour: number;
    }>;
    topChannels: Array<{
      channel: string;
      activity: number;
    }>;
    userActivity: {
      onlineUsers: number;
      peakConcurrency: number;
      averageSessionDuration: number;
    };
    messageStats: {
      totalMessages: number;
      messageTypes: Record<string, number>;
      averageLatency: number;
    };
  }> => {
    const { data } = await api.get('/realtime/analytics', {
      params: timeRange,
    });
    return data;
  },

  /**
   * Get connection status
   */
  getConnectionStatus: async (connectionId: string): Promise<WebSocketConnection> => {
    const { data } = await api.get(`/realtime/connections/${connectionId}/status`);
    return data;
  },

  /**
   * Update connection metadata
   */
  updateConnection: async (
    connectionId: string,
    metadata: Partial<WebSocketConnection['metadata']>
  ): Promise<WebSocketConnection> => {
    const { data } = await api.put(`/realtime/connections/${connectionId}`, { metadata });
    return data;
  },

  /**
   * Get active connections
   */
  getActiveConnections: async (
    userId?: string
  ): Promise<WebSocketConnection[]> => {
    const { data } = await api.get('/realtime/connections', {
      params: { userId },
    });
    return data;
  },
};

export default realTimeAPI;