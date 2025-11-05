import api from './client';

// Order interfaces
export interface AdvancedOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'processing' | 'split' | 'partially_shipped' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
  orderType: 'standard' | 'pre_order' | 'back_order' | 'subscription' | 'gift' | 'B2B';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: AdvancedOrderItem[];
  shipping: AdvancedShippingDetails;
  billing: AdvancedBillingDetails;
  payment: AdvancedPaymentDetails;
  totals: AdvancedOrderTotals;
  workflow: OrderWorkflow;
  tracking: AdvancedOrderTracking;
  metadata: OrderMetadata;
  timeline: OrderEvent[];
  tags: string[];
  notes: OrderNote[];
  splits?: OrderSplit[];
  fulfillment: FulfillmentDetails;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface AdvancedOrderItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  category: string;
  tags: string[];
  customization?: {
    options: Record<string, string>;
    instructions?: string;
  };
  fulfillmentStatus: 'pending' | 'allocated' | 'picked' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  supplier?: {
    id: string;
    name: string;
    leadTime: number;
  };
}

export interface AdvancedShippingDetails {
  method: string;
  carrier: string;
  service: string;
  cost: number;
  estimatedDays: number;
  address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  instructions?: string;
  signature?: boolean;
  insurance?: {
    value: number;
    cost: number;
  };
}

export interface AdvancedBillingDetails {
  address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  taxId?: string;
  vatNumber?: string;
}

export interface AdvancedPaymentDetails {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer' | 'cash_on_delivery' | 'store_credit' | 'gift_card';
  status: 'pending' | 'authorized' | 'captured' | 'partially_captured' | 'refunded' | 'partially_refunded' | 'failed' | 'cancelled';
  transactionId?: string;
  authorizationCode?: string;
  gatewayResponse?: Record<string, any>;
  installments?: {
    total: number;
    current: number;
    amount: number;
  };
  appliedCredits?: {
    storeCredit: number;
    giftCard: number;
    loyalty: number;
  };
}

export interface AdvancedOrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  exchangeRate?: number;
  originalCurrency?: string;
  originalTotal?: number;
}

export interface OrderWorkflow {
  currentStage: string;
  assignedTo?: string;
  department?: string;
  automaticProgression: boolean;
  escalationLevel: number;
  escalatedAt?: string;
  escalatedBy?: string;
  escalationReason?: string;
  approvals?: {
    required: boolean;
    pending: string[];
    completed: string[];
    rejections: string[];
  };
  automation: {
    rules: string[];
    triggers: string[];
    actions: string[];
  };
}

export interface AdvancedOrderTracking {
  status: string;
  location?: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  events: AdvancedTrackingEvent[];
  milestones: {
    ordered: string;
    confirmed?: string;
    processing?: string;
    shipped?: string;
    delivered?: string;
  };
  delivery: {
    attempts: number;
    lastAttempt?: string;
    deliveredTo?: string;
    signature?: string;
    photo?: string;
  };
}

export interface AdvancedTrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
  location?: string;
  carrier?: string;
  details?: Record<string, any>;
}

export interface OrderMetadata {
  source: 'web' | 'mobile' | 'api' | 'admin' | 'pos' | 'marketplace';
  channel: string;
  campaign?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  affiliate?: {
    id: string;
    commission: number;
  };
  customFields: Record<string, any>;
}

export interface OrderEvent {
  id: string;
  type: 'status_change' | 'payment' | 'shipment' | 'note' | 'communication' | 'automation' | 'manual_action';
  timestamp: string;
  user?: string;
  description: string;
  details?: Record<string, any>;
  visibility: 'internal' | 'customer' | 'both';
}

export interface OrderNote {
  id: string;
  content: string;
  type: 'internal' | 'customer' | 'system';
  author: string;
  createdAt: string;
  isImportant: boolean;
  tags?: string[];
}

export interface OrderSplit {
  id: string;
  parentOrderId: string;
  splitNumber: number;
  items: AdvancedOrderItem[];
  shipping: AdvancedShippingDetails;
  tracking: AdvancedOrderTracking;
  status: string;
  totals: AdvancedOrderTotals;
  createdAt: string;
  reason: string;
}

export interface FulfillmentDetails {
  warehouseId?: string;
  warehouseName?: string;
  picklistId?: string;
  packingSlip?: string;
  shippingLabel?: string;
  customsDeclaration?: string;
  fulfillmentDate?: string;
  packingInstructions?: string;
  giftMessage?: string;
  specialHandling?: string[];
}

export interface AdvancedOrderFilters {
  status?: string;
  priority?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  customerId?: string;
  orderNumber?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  tags?: string[];
  channel?: string;
  assignedTo?: string;
  minTotal?: number;
  maxTotal?: number;
  hasNotes?: boolean;
  requiresApproval?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  fulfillmentRate: number;
  averageProcessingTime: number;
  ordersByStatus: { status: string; count: number; percentage: number }[];
  ordersByPriority: { priority: string; count: number; percentage: number }[];
  revenueByMonth: { month: string; revenue: number; orders: number }[];
  topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
  performanceMetrics: {
    onTimeDelivery: number;
    orderAccuracy: number;
    customerSatisfaction: number;
    returnRate: number;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  orderTypes: string[];
  stages: WorkflowStage[];
  automationRules: AutomationRule[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  order: number;
  requirements: string[];
  actions: string[];
  automations: string[];
  timeLimit?: number;
  escalationRules?: {
    condition: string;
    action: string;
    assignTo?: string;
  }[];
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  isActive: boolean;
  priority: number;
}

export interface OrderBatch {
  id: string;
  name: string;
  orderIds: string[];
  batchType: 'fulfillment' | 'shipping' | 'processing' | 'custom';
  status: 'created' | 'processing' | 'completed' | 'failed';
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  results?: {
    processed: number;
    successful: number;
    failed: number;
    errors: string[];
  };
}

// Advanced Order Management API
class AdvancedOrderAPI {
  // Order Management
  async getOrders(filters?: AdvancedOrderFilters): Promise<{ orders: AdvancedOrder[]; total: number; pagination: any }> {
    const response = await api.get('/orders/advanced', { params: filters });
    return response.data;
  }

  async getOrder(orderId: string): Promise<AdvancedOrder> {
    const response = await api.get(`/orders/advanced/${orderId}`);
    return response.data;
  }

  async updateOrder(orderId: string, updates: Partial<AdvancedOrder>): Promise<AdvancedOrder> {
    const response = await api.patch(`/orders/advanced/${orderId}`, updates);
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string, reason?: string): Promise<AdvancedOrder> {
    const response = await api.patch(`/orders/advanced/${orderId}/status`, { status, reason });
    return response.data;
  }

  async assignOrder(orderId: string, assignee: string, department?: string): Promise<AdvancedOrder> {
    const response = await api.patch(`/orders/advanced/${orderId}/assign`, { assignee, department });
    return response.data;
  }

  async escalateOrder(orderId: string, reason: string, assignTo?: string): Promise<AdvancedOrder> {
    const response = await api.post(`/orders/advanced/${orderId}/escalate`, { reason, assignTo });
    return response.data;
  }

  // Order Splitting
  async canSplitOrder(orderId: string): Promise<{ canSplit: boolean; reasons?: string[] }> {
    const response = await api.get(`/orders/advanced/${orderId}/can-split`);
    return response.data;
  }

  async splitOrder(orderId: string, splitRequest: {
    splits: { items: { itemId: string; quantity: number }[]; shipping?: Partial<AdvancedShippingDetails> }[];
    reason: string;
  }): Promise<{ parentOrder: AdvancedOrder; splits: OrderSplit[] }> {
    const response = await api.post(`/orders/advanced/${orderId}/split`, splitRequest);
    return response.data;
  }

  async getSplits(orderId: string): Promise<OrderSplit[]> {
    const response = await api.get(`/orders/advanced/${orderId}/splits`);
    return response.data;
  }

  async mergeSplits(parentOrderId: string, splitIds: string[]): Promise<AdvancedOrder> {
    const response = await api.post(`/orders/advanced/${parentOrderId}/merge-splits`, { splitIds });
    return response.data;
  }

  // Order Timeline & Events
  async getOrderTimeline(orderId: string): Promise<OrderEvent[]> {
    const response = await api.get(`/orders/advanced/${orderId}/timeline`);
    return response.data;
  }

  async addOrderEvent(orderId: string, event: Partial<OrderEvent>): Promise<OrderEvent> {
    const response = await api.post(`/orders/advanced/${orderId}/events`, event);
    return response.data;
  }

  async updateOrderEvent(orderId: string, eventId: string, updates: Partial<OrderEvent>): Promise<OrderEvent> {
    const response = await api.patch(`/orders/advanced/${orderId}/events/${eventId}`, updates);
    return response.data;
  }

  // Order Notes
  async getOrderNotes(orderId: string): Promise<OrderNote[]> {
    const response = await api.get(`/orders/advanced/${orderId}/notes`);
    return response.data;
  }

  async addOrderNote(orderId: string, note: Partial<OrderNote>): Promise<OrderNote> {
    const response = await api.post(`/orders/advanced/${orderId}/notes`, note);
    return response.data;
  }

  async updateOrderNote(orderId: string, noteId: string, updates: Partial<OrderNote>): Promise<OrderNote> {
    const response = await api.patch(`/orders/advanced/${orderId}/notes/${noteId}`, updates);
    return response.data;
  }

  async deleteOrderNote(orderId: string, noteId: string): Promise<void> {
    await api.delete(`/orders/advanced/${orderId}/notes/${noteId}`);
  }

  // Order Tags
  async addOrderTags(orderId: string, tags: string[]): Promise<AdvancedOrder> {
    const response = await api.post(`/orders/advanced/${orderId}/tags`, { tags });
    return response.data;
  }

  async removeOrderTags(orderId: string, tags: string[]): Promise<AdvancedOrder> {
    const response = await api.delete(`/orders/advanced/${orderId}/tags`, { data: { tags } });
    return response.data;
  }

  // Tracking & Fulfillment
  async updateTracking(orderId: string, tracking: Partial<AdvancedOrderTracking>): Promise<AdvancedOrder> {
    const response = await api.patch(`/orders/advanced/${orderId}/tracking`, tracking);
    return response.data;
  }

  async addTrackingEvent(orderId: string, event: Partial<AdvancedTrackingEvent>): Promise<AdvancedTrackingEvent> {
    const response = await api.post(`/orders/advanced/${orderId}/tracking/events`, event);
    return response.data;
  }

  async updateFulfillment(orderId: string, fulfillment: Partial<FulfillmentDetails>): Promise<AdvancedOrder> {
    const response = await api.patch(`/orders/advanced/${orderId}/fulfillment`, fulfillment);
    return response.data;
  }

  async generateShippingLabel(orderId: string, options?: any): Promise<{ label: string; tracking: string }> {
    const response = await api.post(`/orders/advanced/${orderId}/shipping-label`, options);
    return response.data;
  }

  async generatePackingSlip(orderId: string): Promise<{ packingSlip: string }> {
    const response = await api.post(`/orders/advanced/${orderId}/packing-slip`);
    return response.data;
  }

  // Workflow Management
  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    const response = await api.get('/orders/workflow-templates');
    return response.data;
  }

  async createWorkflowTemplate(template: Partial<WorkflowTemplate>): Promise<WorkflowTemplate> {
    const response = await api.post('/orders/workflow-templates', template);
    return response.data;
  }

  async updateWorkflowTemplate(templateId: string, updates: Partial<WorkflowTemplate>): Promise<WorkflowTemplate> {
    const response = await api.patch(`/orders/workflow-templates/${templateId}`, updates);
    return response.data;
  }

  async deleteWorkflowTemplate(templateId: string): Promise<void> {
    await api.delete(`/orders/workflow-templates/${templateId}`);
  }

  async applyWorkflowTemplate(orderId: string, templateId: string): Promise<AdvancedOrder> {
    const response = await api.post(`/orders/advanced/${orderId}/apply-workflow`, { templateId });
    return response.data;
  }

  // Batch Operations
  async createBatch(batch: Partial<OrderBatch>): Promise<OrderBatch> {
    const response = await api.post('/orders/batches', batch);
    return response.data;
  }

  async getBatches(): Promise<OrderBatch[]> {
    const response = await api.get('/orders/batches');
    return response.data;
  }

  async getBatch(batchId: string): Promise<OrderBatch> {
    const response = await api.get(`/orders/batches/${batchId}`);
    return response.data;
  }

  async processBatch(batchId: string): Promise<OrderBatch> {
    const response = await api.post(`/orders/batches/${batchId}/process`);
    return response.data;
  }

  async batchUpdateStatus(orderIds: string[], status: string, reason?: string): Promise<{ updated: string[]; failed: string[] }> {
    const response = await api.patch('/orders/batch/status', { orderIds, status, reason });
    return response.data;
  }

  async batchAssign(orderIds: string[], assignee: string): Promise<{ updated: string[]; failed: string[] }> {
    const response = await api.patch('/orders/batch/assign', { orderIds, assignee });
    return response.data;
  }

  async batchAddTags(orderIds: string[], tags: string[]): Promise<{ updated: string[]; failed: string[] }> {
    const response = await api.patch('/orders/batch/tags', { orderIds, tags });
    return response.data;
  }

  async batchExport(orderIds: string[], format: 'csv' | 'xlsx' | 'pdf'): Promise<Blob> {
    const response = await api.post('/orders/batch/export', { orderIds, format }, { responseType: 'blob' });
    return response.data;
  }

  // Analytics & Reports
  async getOrderStats(filters?: { 
    startDate?: string; 
    endDate?: string; 
    status?: string[];
    channel?: string[];
  }): Promise<OrderStats> {
    const response = await api.get('/orders/stats', { params: filters });
    return response.data;
  }

  async getPerformanceMetrics(period: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
    efficiency: number;
    accuracy: number;
    speed: number;
    satisfaction: number;
    trends: any[];
  }> {
    const response = await api.get('/orders/performance', { params: { period } });
    return response.data;
  }

  async getOrderTrends(period: string, groupBy: 'day' | 'week' | 'month'): Promise<any[]> {
    const response = await api.get('/orders/trends', { params: { period, groupBy } });
    return response.data;
  }

  async getFulfillmentAnalytics(): Promise<{
    averageProcessingTime: number;
    onTimeDeliveryRate: number;
    orderAccuracy: number;
    bottlenecks: string[];
    recommendations: string[];
  }> {
    const response = await api.get('/orders/fulfillment-analytics');
    return response.data;
  }

  // Search & Filters
  async searchOrders(query: string, filters?: AdvancedOrderFilters): Promise<{ orders: AdvancedOrder[]; total: number }> {
    const response = await api.get('/orders/search', { params: { q: query, ...filters } });
    return response.data;
  }

  async getFilterOptions(): Promise<{
    statuses: string[];
    priorities: string[];
    channels: string[];
    paymentMethods: string[];
    shippingMethods: string[];
    tags: string[];
    assignees: string[];
  }> {
    const response = await api.get('/orders/filter-options');
    return response.data;
  }

  // Automation
  async getAutomationRules(): Promise<AutomationRule[]> {
    const response = await api.get('/orders/automation-rules');
    return response.data;
  }

  async createAutomationRule(rule: Partial<AutomationRule>): Promise<AutomationRule> {
    const response = await api.post('/orders/automation-rules', rule);
    return response.data;
  }

  async updateAutomationRule(ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const response = await api.patch(`/orders/automation-rules/${ruleId}`, updates);
    return response.data;
  }

  async deleteAutomationRule(ruleId: string): Promise<void> {
    await api.delete(`/orders/automation-rules/${ruleId}`);
  }

  async testAutomationRule(ruleId: string, orderId: string): Promise<{ success: boolean; actions: string[]; errors?: string[] }> {
    const response = await api.post(`/orders/automation-rules/${ruleId}/test`, { orderId });
    return response.data;
  }

  // Order Communication
  async sendOrderEmail(orderId: string, template: string, customData?: any): Promise<{ sent: boolean; messageId?: string }> {
    const response = await api.post(`/orders/advanced/${orderId}/email`, { template, customData });
    return response.data;
  }

  async sendOrderSMS(orderId: string, message: string): Promise<{ sent: boolean; messageId?: string }> {
    const response = await api.post(`/orders/advanced/${orderId}/sms`, { message });
    return response.data;
  }

  async getOrderCommunications(orderId: string): Promise<any[]> {
    const response = await api.get(`/orders/advanced/${orderId}/communications`);
    return response.data;
  }

  // Advanced Features
  async predictDeliveryDate(orderId: string): Promise<{ estimated: string; confidence: number; factors: string[] }> {
    const response = await api.post(`/orders/advanced/${orderId}/predict-delivery`);
    return response.data;
  }

  async optimizeRouting(orderIds: string[]): Promise<{ routes: any[]; savings: number; efficiency: number }> {
    const response = await api.post('/orders/optimize-routing', { orderIds });
    return response.data;
  }

  async detectAnomalies(orderId: string): Promise<{ anomalies: any[]; riskScore: number; recommendations: string[] }> {
    const response = await api.get(`/orders/advanced/${orderId}/anomalies`);
    return response.data;
  }

  async getRecommendations(orderId: string): Promise<{ 
    processing: string[];
    fulfillment: string[];
    shipping: string[];
    customer: string[];
  }> {
    const response = await api.get(`/orders/advanced/${orderId}/recommendations`);
    return response.data;
  }
}

export const advancedOrderAPI = new AdvancedOrderAPI();
export default advancedOrderAPI;