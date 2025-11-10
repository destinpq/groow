/**
 * Order API Types and POJOs
 * 
 * All order-related request/response types
 */

import { ApiResponse, BaseEntity, PaginatedResponse, BaseFilter, OrderStatus, PaymentStatus, UserEntity } from './common';
import { Product } from './products';

// =================== ORDER ENTITIES ===================

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email?: string;
}

export interface OrderItem extends BaseEntity {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vendorId: string;
  sku: string;
  productName: string;
  productImage?: string;
  specifications?: Record<string, any>;
}

export interface OrderPayment extends BaseEntity {
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentProvider?: string;
  transactionId?: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  paymentDetails?: Record<string, any>;
}

export interface OrderTracking {
  trackingNumber?: string;
  courierName?: string;
  courierUrl?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingEvents?: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  customer?: UserEntity;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  payment?: OrderPayment;
  tracking?: OrderTracking;
  notes?: string;
  couponCode?: string;
  vendorIds: string[];
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// =================== ENUMS ===================

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cod',
  WALLET = 'wallet',
  UPI = 'upi'
}

// =================== ORDER REQUEST TYPES ===================

export interface CreateOrderRequest {
  cartItemIds: string[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  notifyCustomer?: boolean;
}

export interface CancelOrderRequest {
  reason: string;
  refundAmount?: number;
  notifyCustomer?: boolean;
}

export interface OrderFilterRequest extends BaseFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  vendorId?: string;
  orderNumber?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ManifestOrderRequest {
  courierPartner: string;
  pickupDate?: string;
  specialInstructions?: string;
}

export interface ShipOrderRequest {
  trackingNumber: string;
  courierName: string;
  courierUrl?: string;
  estimatedDelivery?: string;
  notifyCustomer?: boolean;
}

export interface HoldOrderRequest {
  reason: string;
  holdUntil?: string;
  notifyCustomer?: boolean;
}

export interface DisputeOrderRequest {
  reason: string;
  description: string;
  evidence?: string[];
}

export interface ReturnOrderRequest {
  items: Array<{
    itemId: string;
    quantity: number;
    reason: string;
  }>;
  returnType: 'refund' | 'exchange';
  pickupRequired?: boolean;
  customerNotes?: string;
}

export interface RefundOrderRequest {
  amount: number;
  reason: string;
  refundMethod?: PaymentMethod;
  notifyCustomer?: boolean;
}

// =================== ORDER RESPONSE TYPES ===================

export interface OrderResponse extends ApiResponse<Order> {}
export interface OrderListResponse extends ApiResponse<PaginatedResponse<Order>> {}
export interface OrdersResponse extends ApiResponse<Order[]> {}

export interface OrderStatsResponse extends ApiResponse<{
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}> {}

export interface OrderTrackingResponse extends ApiResponse<OrderTracking> {}

export interface OrderAnalyticsResponse extends ApiResponse<{
  periodSales: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  statusBreakdown: Record<OrderStatus, number>;
  revenueByVendor: Array<{
    vendorId: string;
    vendorName: string;
    revenue: number;
    orders: number;
  }>;
}> {}

// =================== ORDER API INTERFACE ===================

export interface OrderAPI {
  // Order CRUD
  // POST /api/v1/orders
  createOrder(request: CreateOrderRequest): Promise<OrderResponse>;
  
  // GET /api/v1/orders
  getOrders(filters?: OrderFilterRequest): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/my-orders
  getMyOrders(filters?: OrderFilterRequest): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/stats
  getOrderStats(filters?: { dateFrom?: string; dateTo?: string; vendorId?: string }): Promise<OrderStatsResponse>;
  
  // GET /api/v1/orders/status/:status
  getOrdersByStatus(status: OrderStatus, filters?: BaseFilter): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/:id
  getOrderById(id: string): Promise<OrderResponse>;
  
  // GET /api/v1/orders/number/:orderNumber
  getOrderByNumber(orderNumber: string): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/status
  updateOrderStatus(id: string, request: UpdateOrderStatusRequest): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/cancel
  cancelOrder(id: string, request: CancelOrderRequest): Promise<OrderResponse>;
  
  // Order Management
  // GET /api/v1/orders/manifested
  getManifestOrders(filters?: BaseFilter): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/disputed
  getDisputedOrders(filters?: BaseFilter): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/cancelled
  getCancelledOrders(filters?: BaseFilter): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/hold
  getOrdersOnHold(filters?: BaseFilter): Promise<OrderListResponse>;
  
  // GET /api/v1/orders/returns
  getReturnOrders(filters?: BaseFilter): Promise<OrderListResponse>;
  
  // PATCH /api/v1/orders/:id/manifest
  manifestOrder(id: string, request: ManifestOrderRequest): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/ship
  shipOrder(id: string, request: ShipOrderRequest): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/hold
  holdOrder(id: string, request: HoldOrderRequest): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/dispute
  disputeOrder(id: string, request: DisputeOrderRequest): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/return
  returnOrder(id: string, request: ReturnOrderRequest): Promise<OrderResponse>;
  
  // PATCH /api/v1/orders/:id/refund
  refundOrder(id: string, request: RefundOrderRequest): Promise<OrderResponse>;
  
  // GET /api/v1/orders/:id/tracking
  getOrderTracking(id: string): Promise<OrderTrackingResponse>;
  
  // GET /api/v1/orders/analytics
  getOrderAnalytics(filters?: { dateFrom?: string; dateTo?: string; vendorId?: string }): Promise<OrderAnalyticsResponse>;
}