// Backend order types - synchronized with backend Order entity and DTOs
import type { OrderStatus, PaymentStatus, PaymentMethod } from './enums';

// Order entity structure (from backend/src/modules/order/entities/order.entity.ts)
export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  customerId: string;
  items: Array<{
    productId: string;
    productName: string;
    variantId?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    phone: string;
  };
  billingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  trackingNumber?: string;
  carrierId?: string;
  courierName?: string;
  manifestedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  heldAt?: string;
  disputedAt?: string;
  returnRequestedAt?: string;
  refundedAt?: string;
  holdReason?: string;
  disputeReason?: string;
  disputeDescription?: string;
  returnReason?: string;
  refundAmount?: number;
  refundReason?: string;
  notes?: string;
}

// Order DTOs (from backend/src/modules/order/dto/order.dto.ts)
export interface ShippingAddressDto {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
}

export interface CreateOrderDto {
  cartItemIds: string[];
  shippingAddress: ShippingAddressDto;
  billingAddress?: ShippingAddressDto;
  paymentMethod: PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
}

export interface OrderFilterDto {
  status?: OrderStatus;
  customerId?: string;
  vendorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}