import apiClient from './client';

// Temporary frontend types until backend integration is complete
interface Order {
  id: string;
  orderNumber: string;
  purchaseOrderNumber?: string;
  customerId: string;
  vendorId: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed' | 'refunded';
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded' | 'partially_refunded';
  approvalWorkflow?: any;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  items?: OrderItem[];
  serviceRequirements?: any;
  contractTerms?: any;
  billingDetails?: any;
  deliverySchedule?: any;
  tracking?: any;
  qualityAssurance?: any;
  riskAssessment?: any;
  performanceMetrics?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  configuration?: any;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  progressPercentage?: number;
}

interface OrderCommunication {
  id: string;
  orderId: string;
  communicationType: 'message' | 'update' | 'alert' | 'notification' | 'escalation';
  senderType: 'customer' | 'vendor' | 'internal' | 'system';
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: Date;
}

interface OrderChangeRequest {
  id: string;
  orderId: string;
  changeRequestNumber: string;
  changeType: 'scope_change' | 'timeline_change' | 'pricing_change' | 'specification_change' | 'resource_change';
  title: string;
  description: string;
  proposedChanges: any;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented' | 'cancelled';
}

interface PaginatedResponse<T> { items: T[]; total: number; page: number; limit: number; hasNext: boolean; hasPrev: boolean; }
interface APIResponse<T> { success: boolean; data: T; message?: string; timestamp?: string; }

// Comprehensive B2B Enterprise Order Management API
export const ordersAPI = {
  // ========================================
  // Core Order Operations
  // ========================================

  // Create order with approval workflow
  create: async (data: {
    customerId: string;
    vendorId: string;
    purchaseOrderNumber?: string;
    items: Array<{
      serviceId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      configuration?: any;
    }>;
    serviceRequirements?: any;
    billingDetails?: any;
    contractTerms?: any;
    requiresApproval?: boolean;
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>('/api/v1/orders', data);
    return response.data;
  },

  // Get orders with advanced filtering
  list: async (filters?: {
    status?: string[];
    paymentStatus?: string[];
    customerId?: string;
    vendorId?: string;
    assignedTo?: string;
    dateFrom?: Date;
    dateTo?: Date;
    amountFrom?: number;
    amountTo?: number;
    searchTerm?: string;
    tags?: string[];
    requiresApproval?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<APIResponse<PaginatedResponse<Order>>>('/api/v1/orders', {
      params: {
        ...filters,
        dateFrom: filters?.dateFrom?.toISOString(),
        dateTo: filters?.dateTo?.toISOString(),
      },
    });
    return response.data.data;
  },

  // Get order by ID with full details
  getById: async (id: string, includes?: {
    includeItems?: boolean;
    includeHistory?: boolean;
    includeCommunications?: boolean;
    includeDocuments?: boolean;
    includeChangeRequests?: boolean;
  }): Promise<APIResponse<Order & {
    statusHistory?: any[];
    communications?: OrderCommunication[];
    documents?: any[];
    changeRequests?: OrderChangeRequest[];
  }>> => {
    const response = await apiClient.get<APIResponse<any>>(`/api/v1/orders/${id}`, {
      params: includes,
    });
    return response.data;
  },

  // Get order by order number
  getByNumber: async (orderNumber: string): Promise<APIResponse<Order>> => {
    const response = await apiClient.get<APIResponse<Order>>(`/api/v1/orders/number/${orderNumber}`);
    return response.data;
  },

  // Update order details
  update: async (id: string, data: {
    serviceRequirements?: any;
    billingDetails?: any;
    contractTerms?: any;
    customerNotes?: string;
    vendorNotes?: string;
    tags?: string[];
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.patch<APIResponse<Order>>(`/api/v1/orders/${id}`, data);
    return response.data;
  },

  // Delete/cancel order
  delete: async (id: string, reason: string): Promise<APIResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/orders/${id}`, {
      data: { reason },
    });
    return response.data;
  },

  // ========================================
  // Order Status Management
  // ========================================

  // Update order status
  updateStatus: async (id: string, data: {
    status: Order['status'];
    reason?: string;
    notes?: string;
    notifyStakeholders?: boolean;
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.patch<APIResponse<Order>>(`/api/v1/orders/${id}/status`, data);
    return response.data;
  },

  // Submit for approval
  submitForApproval: async (id: string, data: {
    approvalLevel?: string;
    notes?: string;
    urgency?: 'normal' | 'high' | 'urgent';
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>(`/api/v1/orders/${id}/submit-approval`, data);
    return response.data;
  },

  // Approve order
  approve: async (id: string, data: {
    notes?: string;
    conditions?: string[];
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>(`/api/v1/orders/${id}/approve`, data);
    return response.data;
  },

  // Reject order
  reject: async (id: string, data: {
    reason: string;
    notes?: string;
    suggestedModifications?: string;
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>(`/api/v1/orders/${id}/reject`, data);
    return response.data;
  },

  // Confirm order (vendor acceptance)
  confirm: async (id: string, data: {
    estimatedDeliveryDate?: Date;
    deliverySchedule?: any;
    notes?: string;
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>(`/api/v1/orders/${id}/confirm`, {
      ...data,
      estimatedDeliveryDate: data.estimatedDeliveryDate?.toISOString(),
    });
    return response.data;
  },

  // Start order execution
  start: async (id: string, data: {
    actualStartDate?: Date;
    assignedTeam?: Array<{ userId: string; role: string }>;
    projectPlan?: any;
    notes?: string;
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>(`/api/v1/orders/${id}/start`, {
      ...data,
      actualStartDate: data.actualStartDate?.toISOString(),
    });
    return response.data;
  },

  // Complete order
  complete: async (id: string, data: {
    completionDate?: Date;
    deliverables?: any[];
    qualityReport?: any;
    customerSignoff?: boolean;
  }): Promise<APIResponse<Order>> => {
    const response = await apiClient.post<APIResponse<Order>>(`/api/v1/orders/${id}/complete`, {
      ...data,
      completionDate: data.completionDate?.toISOString(),
    });
    return response.data;
  },

  // ========================================
  // Order Items Management
  // ========================================

  items: {
    // Add item to existing order
    add: async (orderId: string, data: {
      serviceId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      configuration?: any;
    }): Promise<APIResponse<OrderItem>> => {
      const response = await apiClient.post<APIResponse<OrderItem>>(`/api/v1/orders/${orderId}/items`, data);
      return response.data;
    },

    // Update order item
    update: async (itemId: string, data: {
      quantity?: number;
      unitPrice?: number;
      configuration?: any;
      notes?: string;
    }): Promise<APIResponse<OrderItem>> => {
      const response = await apiClient.patch<APIResponse<OrderItem>>(`/api/v1/order-items/${itemId}`, data);
      return response.data;
    },

    // Remove item from order
    remove: async (itemId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/order-items/${itemId}`);
      return response.data;
    },

    // Update item progress
    updateProgress: async (itemId: string, data: {
      progressPercentage: number;
      status?: OrderItem['status'];
      notes?: string;
      milestoneCompleted?: string;
    }): Promise<APIResponse<OrderItem>> => {
      const response = await apiClient.patch<APIResponse<OrderItem>>(`/api/v1/order-items/${itemId}/progress`, data);
      return response.data;
    },
  },

  // ========================================
  // Communications & Collaboration
  // ========================================

  communications: {
    // Get order communications
    list: async (orderId: string, filters?: {
      communicationType?: string[];
      senderType?: string[];
      priority?: string[];
      isInternal?: boolean;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<OrderCommunication>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<OrderCommunication>>>(`/api/v1/orders/${orderId}/communications`, {
        params: filters,
      });
      return response.data.data;
    },

    // Send message/communication
    send: async (orderId: string, data: {
      communicationType: OrderCommunication['communicationType'];
      subject: string;
      message: string;
      priority?: OrderCommunication['priority'];
      attachments?: string[];
      isInternal?: boolean;
      requiresResponse?: boolean;
      responseByDate?: Date;
      recipients?: string[];
    }): Promise<APIResponse<OrderCommunication>> => {
      const response = await apiClient.post<APIResponse<OrderCommunication>>(`/api/v1/orders/${orderId}/communications`, {
        ...data,
        responseByDate: data.responseByDate?.toISOString(),
      });
      return response.data;
    },

    // Mark communication as read
    markRead: async (communicationId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.patch<APIResponse<{ success: boolean }>>(`/api/v1/order-communications/${communicationId}/read`);
      return response.data;
    },

    // Reply to communication
    reply: async (communicationId: string, data: {
      message: string;
      attachments?: string[];
    }): Promise<APIResponse<OrderCommunication>> => {
      const response = await apiClient.post<APIResponse<OrderCommunication>>(`/api/v1/order-communications/${communicationId}/reply`, data);
      return response.data;
    },
  },

  // ========================================
  // Document Management
  // ========================================

  documents: {
    // List order documents
    list: async (orderId: string, filters?: {
      documentType?: string[];
      accessLevel?: string[];
    }): Promise<APIResponse<any[]>> => {
      const response = await apiClient.get<APIResponse<any[]>>(`/api/v1/orders/${orderId}/documents`, {
        params: filters,
      });
      return response.data;
    },

    // Upload document
    upload: async (orderId: string, data: {
      file: File;
      documentType: 'contract' | 'invoice' | 'receipt' | 'delivery_confirmation' | 'quality_report' | 'change_order' | 'other';
      documentName: string;
      description?: string;
      accessLevel?: 'public' | 'customer_only' | 'vendor_only' | 'internal_only';
      requiresSignature?: boolean;
    }): Promise<APIResponse<any>> => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('documentType', data.documentType);
      formData.append('documentName', data.documentName);
      if (data.description) formData.append('description', data.description);
      if (data.accessLevel) formData.append('accessLevel', data.accessLevel);
      if (data.requiresSignature) formData.append('requiresSignature', String(data.requiresSignature));

      const response = await apiClient.post<APIResponse<any>>(`/api/v1/orders/${orderId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    // Download document
    download: async (documentId: string): Promise<Blob> => {
      const response = await apiClient.get(`/api/v1/order-documents/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },

    // Sign document
    sign: async (documentId: string, data: {
      signatureData: string;
      signerName: string;
      signerEmail: string;
    }): Promise<APIResponse<any>> => {
      const response = await apiClient.post<APIResponse<any>>(`/api/v1/order-documents/${documentId}/sign`, data);
      return response.data;
    },

    // Delete document
    delete: async (documentId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/order-documents/${documentId}`);
      return response.data;
    },
  },

  // ========================================
  // Change Management
  // ========================================

  changeRequests: {
    // Create change request
    create: async (orderId: string, data: {
      changeType: OrderChangeRequest['changeType'];
      title: string;
      description: string;
      justification: string;
      proposedChanges: any;
    }): Promise<APIResponse<OrderChangeRequest>> => {
      const response = await apiClient.post<APIResponse<OrderChangeRequest>>(`/api/v1/orders/${orderId}/change-requests`, data);
      return response.data;
    },

    // List change requests
    list: async (orderId: string, filters?: {
      changeType?: string[];
      status?: string[];
    }): Promise<APIResponse<OrderChangeRequest[]>> => {
      const response = await apiClient.get<APIResponse<OrderChangeRequest[]>>(`/api/v1/orders/${orderId}/change-requests`, {
        params: filters,
      });
      return response.data;
    },

    // Review change request
    review: async (changeRequestId: string, data: {
      status: 'approved' | 'rejected';
      reviewNotes?: string;
    }): Promise<APIResponse<OrderChangeRequest>> => {
      const response = await apiClient.patch<APIResponse<OrderChangeRequest>>(`/api/v1/order-change-requests/${changeRequestId}/review`, data);
      return response.data;
    },

    // Implement change request
    implement: async (changeRequestId: string): Promise<APIResponse<OrderChangeRequest>> => {
      const response = await apiClient.patch<APIResponse<OrderChangeRequest>>(`/api/v1/order-change-requests/${changeRequestId}/implement`);
      return response.data;
    },
  },

  // ========================================
  // Analytics & Reporting
  // ========================================

  analytics: {
    // Get order performance dashboard
    getDashboard: async (filters?: {
      dateFrom?: Date;
      dateTo?: Date;
      vendorId?: string;
      customerId?: string;
    }): Promise<APIResponse<{
      summary: {
        totalOrders: number;
        totalValue: number;
        averageOrderValue: number;
        completionRate: number;
        onTimeDeliveryRate: number;
      };
      statusBreakdown: Record<string, number>;
      revenueMetrics: {
        daily: Array<{ date: string; amount: number; count: number }>;
        monthly: Array<{ month: string; amount: number; count: number }>;
      };
      performanceMetrics: {
        averageResponseTime: number;
        customerSatisfactionScore: number;
        qualityScore: number;
        issueResolutionTime: number;
      };
      topServices: Array<{
        serviceId: string;
        serviceName: string;
        orderCount: number;
        revenue: number;
        averageRating: number;
      }>;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/orders/analytics/dashboard', {
        params: {
          ...filters,
          dateFrom: filters?.dateFrom?.toISOString(),
          dateTo: filters?.dateTo?.toISOString(),
        },
      });
      return response.data;
    },

    // Get detailed order analytics
    getOrderAnalytics: async (orderId: string): Promise<APIResponse<{
      timeline: Array<{ event: string; timestamp: Date; duration?: number }>;
      milestoneProgress: Array<{ milestone: string; planned: Date; actual?: Date; status: string }>;
      resourceUtilization: any;
      costAnalysis: any;
      qualityMetrics: any;
      riskAssessment: any;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>(`/api/v1/orders/${orderId}/analytics`);
      return response.data;
    },

    // Generate reports
    generateReport: async (options: {
      reportType: 'order_summary' | 'performance_analysis' | 'vendor_scorecard' | 'customer_analysis';
      format: 'pdf' | 'excel' | 'csv';
      filters?: any;
      includeCharts?: boolean;
    }): Promise<APIResponse<{
      reportId: string;
      downloadUrl: string;
      expiresAt: Date;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/orders/analytics/reports', options);
      return response.data;
    },
  },

  // ========================================
  // Specialized Order Views
  // ========================================

  // Get orders requiring approval
  getPendingApproval: async (filters?: {
    approvalLevel?: string;
    assignedTo?: string;
    urgency?: string[];
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<APIResponse<PaginatedResponse<Order>>>('/api/v1/orders/pending-approval', {
      params: filters,
    });
    return response.data.data;
  },

  // Get active orders (in progress)
  getActive: async (filters?: {
    vendorId?: string;
    assignedTo?: string;
    priorityLevel?: string[];
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<APIResponse<PaginatedResponse<Order>>>('/api/v1/orders/active', {
      params: filters,
    });
    return response.data.data;
  },

  // Get orders at risk
  getAtRisk: async (filters?: {
    riskLevel?: string[];
    vendorId?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<APIResponse<PaginatedResponse<Order>>>('/api/v1/orders/at-risk', {
      params: filters,
    });
    return response.data.data;
  },

  // Get overdue orders
  getOverdue: async (): Promise<APIResponse<Order[]>> => {
    const response = await apiClient.get<APIResponse<Order[]>>('/api/v1/orders/overdue');
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================

  bulkOperations: {
    // Bulk status update
    updateStatus: async (orderIds: string[], data: {
      status: Order['status'];
      reason?: string;
      notes?: string;
    }): Promise<APIResponse<{
      updated: number;
      failed: number;
      errors: Array<{ orderId: string; error: string }>;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/orders/bulk/update-status', {
        orderIds,
        ...data,
      });
      return response.data;
    },

    // Bulk assign
    assign: async (orderIds: string[], assigneeId: string): Promise<APIResponse<{
      assigned: number;
      failed: number;
      errors: Array<{ orderId: string; error: string }>;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/orders/bulk/assign', {
        orderIds,
        assigneeId,
      });
      return response.data;
    },

    // Bulk export
    export: async (orderIds: string[], format: 'csv' | 'excel'): Promise<Blob> => {
      const response = await apiClient.post('/api/v1/orders/bulk/export', {
        orderIds,
        format,
      }, {
        responseType: 'blob',
      });
      return response.data;
    },
  },

  // ========================================
  // Integration & Automation
  // ========================================

  integrations: {
    // Sync with ERP system
    syncWithERP: async (orderId: string, erpSystem: string): Promise<APIResponse<{
      syncStatus: 'success' | 'failed' | 'partial';
      erpOrderId?: string;
      errors?: string[];
    }>> => {
      const response = await apiClient.post<APIResponse<any>>(`/api/v1/orders/${orderId}/sync-erp`, {
        erpSystem,
      });
      return response.data;
    },

    // Get integration status
    getIntegrationStatus: async (orderId: string): Promise<APIResponse<{
      erpSync?: any;
      procurementSync?: any;
      notificationStatus: any;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>(`/api/v1/orders/${orderId}/integration-status`);
      return response.data;
    },

    // Configure notifications
    configureNotifications: async (orderId: string, settings: {
      email: boolean;
      sms: boolean;
      webhooks: string[];
      escalationRules?: any[];
    }): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.post<APIResponse<{ success: boolean }>>(`/api/v1/orders/${orderId}/configure-notifications`, settings);
      return response.data;
    },
  },
};

export default ordersAPI;

// Export types for index.ts compatibility  
export type { Order, OrderItem };
export type CreateOrderData = Order;
export type OrderFilters = {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
  vendorId?: string;
};

// Address type for compatibility (if needed)
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
