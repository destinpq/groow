import apiClient from './client';

// Temporary frontend types until backend integration is complete
interface Cart {
  id: string;
  cartNumber: string;
  customerId: string;
  vendorId?: string;
  sessionId?: string;
  status: 'active' | 'saved' | 'abandoned' | 'merged' | 'converted' | 'expired';
  purchaseOrderReference?: string;
  costCenter?: string;
  budgetCode?: string;
  departmentCode?: string;
  requesterId?: string;
  approverId?: string;
  approvalStatus: 'none' | 'required' | 'pending' | 'approved' | 'rejected';
  approvalNotes?: string;
  currency: string;
  requiresQuote: boolean;
  isTemplate: boolean;
  templateName?: string;
  isRecurring: boolean;
  recurringSchedule?: any;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingEstimate: number;
  totalAmount: number;
  itemCount: number;
  shippingAddress?: any;
  billingAddress?: any;
  preferredDeliveryDate?: Date;
  deliveryInstructions?: string;
  deliveryMethod: 'standard' | 'express' | 'overnight' | 'scheduled';
  businessRules?: any;
  complianceRequirements?: any;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  lastActivityAt?: Date;
  sessionDurationMinutes: number;
  visitCount: number;
  abandonedAt?: Date;
  convertedAt?: Date;
  convertedOrderId?: string;
  erpData?: any;
  customData?: any;
  items?: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  id: string;
  cartId: string;
  productId?: string;
  serviceId?: string;
  variantId?: string;
  sku?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  status: 'active' | 'saved' | 'out_of_stock' | 'discontinued' | 'requires_quote';
  contractPriceId?: string;
  requiresApproval: boolean;
  discountPercentage?: number;
  discountAmount: number;
  discountReason?: string;
  configuration?: any;
  customizations?: any;
  specialInstructions?: string;
  requestedDeliveryDate?: Date;
  availableQuantity?: number;
  leadTime?: string;
  isAvailable: boolean;
  unavailableReason?: string;
  complianceInfo?: any;
  qualityRequirements?: any;
  certifications?: string[];
  notes?: string;
  imageUrls?: string[];
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface SavedCart {
  id: string;
  customerId: string;
  cartId?: string;
  name: string;
  description?: string;
  isTemplate: boolean;
  isShared: boolean;
  cartData: any;
  isRecurring: boolean;
  scheduleConfig?: any;
  nextExecutionDate?: Date;
  accessLevel: 'private' | 'team' | 'department' | 'company' | 'public';
  allowedUsers?: string[];
  allowedRoles?: string[];
  usageCount: number;
  lastUsedAt?: Date;
  averageOrderValue?: number;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CartAbandonment {
  id: string;
  cartId: string;
  customerId: string;
  abandonedAt: Date;
  sessionDurationMinutes: number;
  itemCount: number;
  cartValue: number;
  currency: string;
  lastPageVisited?: string;
  exitTrigger?: string;
  deviceInfo?: any;
  browserInfo?: any;
  recoveryStatus: 'not_attempted' | 'email_sent' | 'sms_sent' | 'push_sent' | 'recovered' | 'expired';
  recoveryAttempts: number;
  firstRecoveryAttempt?: Date;
  lastRecoveryAttempt?: Date;
  recoveredAt?: Date;
  recoveryOrderId?: string;
  analyticsData?: any;
  notes?: string;
}

interface CartShare {
  id: string;
  cartId: string;
  sharedByUserId: string;
  sharedWithUserId: string;
  permission: 'view' | 'edit' | 'approve' | 'admin';
  shareStatus: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  expiresAt?: Date;
  respondedAt?: Date;
  responseMessage?: string;
  notifyOnChanges: boolean;
  notifyOnCheckout: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Wishlist {
  id: string;
  customerId: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isShared: boolean;
  visibility: 'private' | 'team' | 'department' | 'company' | 'public';
  budgetLimit?: number;
  currency: string;
  targetDate?: Date;
  priority?: string;
  tags?: string[];
  notes?: string;
  itemCount: number;
  estimatedTotal: number;
  items?: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface WishlistItem {
  id: string;
  wishlistId: string;
  productId?: string;
  serviceId?: string;
  variantId?: string;
  name: string;
  description?: string;
  desiredQuantity: number;
  targetPrice?: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  neededByDate?: Date;
  notes?: string;
  businessJustification?: string;
  isPriceAlert: boolean;
  isStockAlert: boolean;
  lastPriceCheck?: Date;
  currentPrice?: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedResponse<T> { items: T[]; total: number; page: number; limit: number; hasNext: boolean; hasPrev: boolean; }
interface APIResponse<T> { success: boolean; data: T; message?: string; timestamp?: string; }

// Comprehensive B2B Enterprise Cart Management API
export const cartAPI = {
  // ========================================
  // Core Cart Operations
  // ========================================

  // Get current cart with advanced features
  getCart: async (includes?: {
    includeItems?: boolean;
    includeShares?: boolean;
    includeAbandonment?: boolean;
    includePricing?: boolean;
  }): Promise<APIResponse<Cart>> => {
    const response = await apiClient.get<APIResponse<Cart>>('/api/v1/cart', {
      params: includes,
    });
    return response.data;
  },

  // Create new cart
  createCart: async (data: {
    vendorId?: string;
    purchaseOrderReference?: string;
    costCenter?: string;
    budgetCode?: string;
    departmentCode?: string;
    requiresApproval?: boolean;
    businessRules?: any;
    notes?: string;
  }): Promise<APIResponse<Cart>> => {
    const response = await apiClient.post<APIResponse<Cart>>('/api/v1/cart', data);
    return response.data;
  },

  // Update cart details
  updateCart: async (cartId: string, data: {
    purchaseOrderReference?: string;
    costCenter?: string;
    budgetCode?: string;
    departmentCode?: string;
    shippingAddress?: any;
    billingAddress?: any;
    preferredDeliveryDate?: Date;
    deliveryInstructions?: string;
    deliveryMethod?: Cart['deliveryMethod'];
    notes?: string;
    tags?: string[];
  }): Promise<APIResponse<Cart>> => {
    const response = await apiClient.patch<APIResponse<Cart>>(`/api/v1/cart/${cartId}`, {
      ...data,
      preferredDeliveryDate: data.preferredDeliveryDate?.toISOString(),
    });
    return response.data;
  },

  // Clear cart
  clearCart: async (cartId?: string): Promise<APIResponse<{ success: boolean }>> => {
    const url = cartId ? `/api/v1/cart/${cartId}/clear` : '/api/v1/cart/clear';
    const response = await apiClient.delete<APIResponse<{ success: boolean }>>(url);
    return response.data;
  },

  // ========================================
  // Cart Item Management
  // ========================================

  items: {
    // Add item to cart
    add: async (data: {
      cartId?: string;
      productId?: string;
      serviceId?: string;
      variantId?: string;
      quantity: number;
      unitPrice?: number;
      configuration?: any;
      customizations?: any;
      specialInstructions?: string;
      requestedDeliveryDate?: Date;
      requiresApproval?: boolean;
    }): Promise<APIResponse<{
      cartItem: CartItem;
      cart: Cart;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/cart/items', {
        ...data,
        requestedDeliveryDate: data.requestedDeliveryDate?.toISOString(),
      });
      return response.data;
    },

    // Update cart item
    update: async (itemId: string, data: {
      quantity?: number;
      unitPrice?: number;
      configuration?: any;
      customizations?: any;
      specialInstructions?: string;
      requestedDeliveryDate?: Date;
      notes?: string;
    }): Promise<APIResponse<{
      cartItem: CartItem;
      cart: Cart;
    }>> => {
      const response = await apiClient.patch<APIResponse<any>>(`/api/v1/cart/items/${itemId}`, {
        ...data,
        requestedDeliveryDate: data.requestedDeliveryDate?.toISOString(),
      });
      return response.data;
    },

    // Remove item from cart
    remove: async (itemId: string): Promise<APIResponse<Cart>> => {
      const response = await apiClient.delete<APIResponse<Cart>>(`/api/v1/cart/items/${itemId}`);
      return response.data;
    },

    // Apply discount to item
    applyDiscount: async (itemId: string, data: {
      discountPercentage?: number;
      discountAmount?: number;
      discountReason: string;
    }): Promise<APIResponse<CartItem>> => {
      const response = await apiClient.post<APIResponse<CartItem>>(`/api/v1/cart/items/${itemId}/discount`, data);
      return response.data;
    },

    // Get item availability
    checkAvailability: async (itemId: string): Promise<APIResponse<{
      isAvailable: boolean;
      availableQuantity?: number;
      leadTime?: string;
      unavailableReason?: string;
    }>> => {
      const response = await apiClient.get<APIResponse<any>>(`/api/v1/cart/items/${itemId}/availability`);
      return response.data;
    },

    // Bulk operations
    bulkAdd: async (items: Array<{
      productId?: string;
      serviceId?: string;
      variantId?: string;
      quantity: number;
      configuration?: any;
    }>): Promise<APIResponse<{
      added: CartItem[];
      failed: Array<{ item: any; error: string }>;
      cart: Cart;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>('/api/v1/cart/items/bulk-add', { items });
      return response.data;
    },

    bulkUpdate: async (updates: Array<{
      itemId: string;
      quantity?: number;
      notes?: string;
    }>): Promise<APIResponse<{
      updated: CartItem[];
      failed: Array<{ itemId: string; error: string }>;
      cart: Cart;
    }>> => {
      const response = await apiClient.patch<APIResponse<any>>('/api/v1/cart/items/bulk-update', { updates });
      return response.data;
    },

    bulkRemove: async (itemIds: string[]): Promise<APIResponse<Cart>> => {
      const response = await apiClient.delete<APIResponse<Cart>>('/api/v1/cart/items/bulk-remove', {
        data: { itemIds },
      });
      return response.data;
    },
  },

  // ========================================
  // B2B Approval Workflow
  // ========================================

  approval: {
    // Submit cart for approval
    submitForApproval: async (cartId: string, data: {
      approverId: string;
      notes?: string;
      urgency?: 'normal' | 'high' | 'urgent';
    }): Promise<APIResponse<Cart>> => {
      const response = await apiClient.post<APIResponse<Cart>>(`/api/v1/cart/${cartId}/submit-approval`, data);
      return response.data;
    },

    // Approve cart
    approve: async (cartId: string, data: {
      notes?: string;
      conditions?: string[];
    }): Promise<APIResponse<Cart>> => {
      const response = await apiClient.post<APIResponse<Cart>>(`/api/v1/cart/${cartId}/approve`, data);
      return response.data;
    },

    // Reject cart
    reject: async (cartId: string, data: {
      reason: string;
      notes?: string;
      suggestedModifications?: string;
    }): Promise<APIResponse<Cart>> => {
      const response = await apiClient.post<APIResponse<Cart>>(`/api/v1/cart/${cartId}/reject`, data);
      return response.data;
    },

    // Get pending approvals
    getPendingApprovals: async (filters?: {
      approverId?: string;
      urgency?: string[];
      minAmount?: number;
      maxAmount?: number;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<Cart>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<Cart>>>('/api/v1/cart/pending-approvals', {
        params: filters,
      });
      return response.data.data;
    },
  },

  // ========================================
  // Saved Carts & Templates
  // ========================================

  savedCarts: {
    // Save current cart
    save: async (cartId: string, data: {
      name: string;
      description?: string;
      isTemplate?: boolean;
      accessLevel?: SavedCart['accessLevel'];
      allowedUsers?: string[];
      allowedRoles?: string[];
      tags?: string[];
    }): Promise<APIResponse<SavedCart>> => {
      const response = await apiClient.post<APIResponse<SavedCart>>(`/api/v1/cart/${cartId}/save`, data);
      return response.data;
    },

    // List saved carts
    list: async (filters?: {
      isTemplate?: boolean;
      isShared?: boolean;
      accessLevel?: string[];
      tags?: string[];
      searchTerm?: string;
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<SavedCart>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<SavedCart>>>('/api/v1/cart/saved', {
        params: filters,
      });
      return response.data.data;
    },

    // Load saved cart
    load: async (savedCartId: string, options?: {
      replaceCurrentCart?: boolean;
      updatePrices?: boolean;
    }): Promise<APIResponse<Cart>> => {
      const response = await apiClient.post<APIResponse<Cart>>(`/api/v1/cart/saved/${savedCartId}/load`, options);
      return response.data;
    },

    // Update saved cart
    update: async (savedCartId: string, data: {
      name?: string;
      description?: string;
      accessLevel?: SavedCart['accessLevel'];
      tags?: string[];
      notes?: string;
    }): Promise<APIResponse<SavedCart>> => {
      const response = await apiClient.patch<APIResponse<SavedCart>>(`/api/v1/cart/saved/${savedCartId}`, data);
      return response.data;
    },

    // Delete saved cart
    delete: async (savedCartId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/cart/saved/${savedCartId}`);
      return response.data;
    },

    // Use template to create cart
    useTemplate: async (templateId: string): Promise<APIResponse<Cart>> => {
      const response = await apiClient.post<APIResponse<Cart>>(`/api/v1/cart/templates/${templateId}/use`);
      return response.data;
    },
  },

  // ========================================
  // Cart Sharing & Collaboration
  // ========================================

  sharing: {
    // Share cart with user
    shareCart: async (cartId: string, data: {
      sharedWithUserId: string;
      permission: CartShare['permission'];
      message?: string;
      expiresAt?: Date;
      notifyOnChanges?: boolean;
      notifyOnCheckout?: boolean;
    }): Promise<APIResponse<CartShare>> => {
      const response = await apiClient.post<APIResponse<CartShare>>(`/api/v1/cart/${cartId}/share`, {
        ...data,
        expiresAt: data.expiresAt?.toISOString(),
      });
      return response.data;
    },

    // Get cart shares
    getShares: async (cartId: string): Promise<APIResponse<CartShare[]>> => {
      const response = await apiClient.get<APIResponse<CartShare[]>>(`/api/v1/cart/${cartId}/shares`);
      return response.data;
    },

    // Respond to cart share
    respondToShare: async (shareId: string, data: {
      shareStatus: 'accepted' | 'declined';
      responseMessage?: string;
    }): Promise<APIResponse<CartShare>> => {
      const response = await apiClient.patch<APIResponse<CartShare>>(`/api/v1/cart/shares/${shareId}/respond`, data);
      return response.data;
    },

    // Update share permissions
    updateShare: async (shareId: string, data: {
      permission?: CartShare['permission'];
      expiresAt?: Date;
      notifyOnChanges?: boolean;
      notifyOnCheckout?: boolean;
    }): Promise<APIResponse<CartShare>> => {
      const response = await apiClient.patch<APIResponse<CartShare>>(`/api/v1/cart/shares/${shareId}`, {
        ...data,
        expiresAt: data.expiresAt?.toISOString(),
      });
      return response.data;
    },

    // Revoke cart share
    revokeShare: async (shareId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/cart/shares/${shareId}`);
      return response.data;
    },

    // Get shared with me carts
    getSharedWithMe: async (filters?: {
      permission?: string[];
      shareStatus?: string[];
    }): Promise<APIResponse<CartShare[]>> => {
      const response = await apiClient.get<APIResponse<CartShare[]>>('/api/v1/cart/shared-with-me', {
        params: filters,
      });
      return response.data;
    },
  },

  // ========================================
  // Abandonment Recovery
  // ========================================

  abandonment: {
    // Track cart abandonment
    trackAbandonment: async (cartId: string, data: {
      lastPageVisited?: string;
      exitTrigger?: string;
      deviceInfo?: any;
      browserInfo?: any;
    }): Promise<APIResponse<CartAbandonment>> => {
      const response = await apiClient.post<APIResponse<CartAbandonment>>(`/api/v1/cart/${cartId}/abandonment`, data);
      return response.data;
    },

    // Get abandoned carts
    getAbandoned: async (filters?: {
      dateFrom?: Date;
      dateTo?: Date;
      minValue?: number;
      maxValue?: number;
      recoveryStatus?: string[];
      page?: number;
      limit?: number;
    }): Promise<PaginatedResponse<CartAbandonment>> => {
      const response = await apiClient.get<APIResponse<PaginatedResponse<CartAbandonment>>>('/api/v1/cart/abandoned', {
        params: {
          ...filters,
          dateFrom: filters?.dateFrom?.toISOString(),
          dateTo: filters?.dateTo?.toISOString(),
        },
      });
      return response.data.data;
    },

    // Send recovery email
    sendRecoveryEmail: async (abandonmentId: string, data: {
      emailTemplate?: string;
      personalizedMessage?: string;
      includeIncentive?: boolean;
      incentiveType?: 'discount' | 'free_shipping' | 'gift';
      incentiveValue?: number;
    }): Promise<APIResponse<{ success: boolean; emailSent: boolean }>> => {
      const response = await apiClient.post<APIResponse<any>>(`/api/v1/cart/abandonment/${abandonmentId}/recovery-email`, data);
      return response.data;
    },

    // Mark as recovered
    markRecovered: async (abandonmentId: string, orderId: string): Promise<APIResponse<CartAbandonment>> => {
      const response = await apiClient.patch<APIResponse<CartAbandonment>>(`/api/v1/cart/abandonment/${abandonmentId}/recovered`, {
        orderId,
      });
      return response.data;
    },
  },

  // ========================================
  // Pricing & Validation
  // ========================================

  validation: {
    // Validate entire cart
    validateCart: async (cartId?: string): Promise<APIResponse<{
      isValid: boolean;
      issues: Array<{
        type: 'availability' | 'pricing' | 'compliance' | 'approval' | 'configuration';
        itemId?: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
      }>;
      updatedCart: Cart;
    }>> => {
      const url = cartId ? `/api/v1/cart/${cartId}/validate` : '/api/v1/cart/validate';
      const response = await apiClient.post<APIResponse<any>>(url);
      return response.data;
    },

    // Update cart pricing
    updatePricing: async (cartId?: string): Promise<APIResponse<Cart>> => {
      const url = cartId ? `/api/v1/cart/${cartId}/update-pricing` : '/api/v1/cart/update-pricing';
      const response = await apiClient.post<APIResponse<Cart>>(url);
      return response.data;
    },

    // Check compliance
    checkCompliance: async (cartId?: string): Promise<APIResponse<{
      isCompliant: boolean;
      violations: Array<{
        rule: string;
        description: string;
        itemIds?: string[];
        severity: 'error' | 'warning';
      }>;
    }>> => {
      const url = cartId ? `/api/v1/cart/${cartId}/compliance` : '/api/v1/cart/compliance';
      const response = await apiClient.get<APIResponse<any>>(url);
      return response.data;
    },
  },

  // ========================================
  // Analytics & Reporting
  // ========================================

  analytics: {
    // Get cart analytics
    getCartAnalytics: async (cartId: string): Promise<APIResponse<{
      sessionData: {
        totalSessions: number;
        averageSessionDuration: number;
        totalViewTime: number;
        bounceRate: number;
      };
      itemAnalytics: Array<{
        itemId: string;
        addedAt: Date;
        timeInCart: number;
        priceChanges: number;
        interactionCount: number;
      }>;
      conversionProbability: number;
      recommendedActions: string[];
    }>> => {
      const response = await apiClient.get<APIResponse<any>>(`/api/v1/cart/${cartId}/analytics`);
      return response.data;
    },

    // Get abandonment analytics
    getAbandonmentAnalytics: async (filters?: {
      dateFrom?: Date;
      dateTo?: Date;
    }): Promise<APIResponse<{
      abandonmentRate: number;
      averageAbandonmentValue: number;
      recoveryRate: number;
      topAbandonmentReasons: Array<{ reason: string; count: number }>;
      abandoncomeToTheBusinessDashboard: {
        totalAbandoned: number;
        totalRecovered: number;
        lostRevenue: number;
        recoveredRevenue: number;
      };
    }>> => {
      const response = await apiClient.get<APIResponse<any>>('/api/v1/cart/analytics/abandonment', {
        params: {
          dateFrom: filters?.dateFrom?.toISOString(),
          dateTo: filters?.dateTo?.toISOString(),
        },
      });
      return response.data;
    },
  },

  // ========================================
  // Utility Functions
  // ========================================

  // Get cart item count
  getItemCount: async (cartId?: string): Promise<number> => {
    const cartResponse = await cartAPI.getCart();
    return cartResponse.data.itemCount;
  },

  // Check if item is in cart
  isInCart: async (productId?: string, serviceId?: string, variantId?: string): Promise<boolean> => {
    try {
      const cartResponse = await cartAPI.getCart({ includeItems: true });
      const cart = cartResponse.data;
      return cart.items?.some(item => 
        (productId && item.productId === productId) ||
        (serviceId && item.serviceId === serviceId) &&
        (!variantId || item.variantId === variantId)
      ) || false;
    } catch {
      return false;
    }
  },

  // Get cart total
  getCartTotal: async (cartId?: string): Promise<number> => {
    const cartResponse = await cartAPI.getCart();
    return cartResponse.data.totalAmount;
  },

  // Convert cart to order
  convertToOrder: async (cartId?: string, options?: {
    paymentMethodId?: string;
    shippingMethodId?: string;
    notes?: string;
  }): Promise<APIResponse<{ orderId: string; orderNumber: string }>> => {
    const url = cartId ? `/api/v1/cart/${cartId}/convert-to-order` : '/api/v1/cart/convert-to-order';
    const response = await apiClient.post<APIResponse<any>>(url, options);
    return response.data;
  },
};

// ========================================
// Wishlist API
// ========================================

export const wishlistAPI = {
  // Create wishlist
  create: async (data: {
    name: string;
    description?: string;
    visibility?: Wishlist['visibility'];
    budgetLimit?: number;
    targetDate?: Date;
    priority?: string;
    tags?: string[];
  }): Promise<APIResponse<Wishlist>> => {
    const response = await apiClient.post<APIResponse<Wishlist>>('/api/v1/wishlists', {
      ...data,
      targetDate: data.targetDate?.toISOString(),
    });
    return response.data;
  },

  // Get wishlists
  list: async (filters?: {
    visibility?: string[];
    priority?: string[];
    tags?: string[];
    searchTerm?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Wishlist>> => {
    const response = await apiClient.get<APIResponse<PaginatedResponse<Wishlist>>>('/api/v1/wishlists', {
      params: filters,
    });
    return response.data.data;
  },

  // Get default wishlist
  getDefault: async (): Promise<APIResponse<Wishlist>> => {
    const response = await apiClient.get<APIResponse<Wishlist>>('/api/v1/wishlists/default');
    return response.data;
  },

  // Get wishlist by ID
  getById: async (wishlistId: string): Promise<APIResponse<Wishlist>> => {
    const response = await apiClient.get<APIResponse<Wishlist>>(`/api/v1/wishlists/${wishlistId}`);
    return response.data;
  },

  // Update wishlist
  update: async (wishlistId: string, data: {
    name?: string;
    description?: string;
    visibility?: Wishlist['visibility'];
    budgetLimit?: number;
    targetDate?: Date;
    priority?: string;
    tags?: string[];
    notes?: string;
  }): Promise<APIResponse<Wishlist>> => {
    const response = await apiClient.patch<APIResponse<Wishlist>>(`/api/v1/wishlists/${wishlistId}`, {
      ...data,
      targetDate: data.targetDate?.toISOString(),
    });
    return response.data;
  },

  // Delete wishlist
  delete: async (wishlistId: string): Promise<APIResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/wishlists/${wishlistId}`);
    return response.data;
  },

  // Wishlist items
  items: {
    // Add item to wishlist
    add: async (wishlistId: string, data: {
      productId?: string;
      serviceId?: string;
      variantId?: string;
      name: string;
      desiredQuantity?: number;
      targetPrice?: number;
      priority?: WishlistItem['priority'];
      neededByDate?: Date;
      notes?: string;
      businessJustification?: string;
      isPriceAlert?: boolean;
      isStockAlert?: boolean;
    }): Promise<APIResponse<WishlistItem>> => {
      const response = await apiClient.post<APIResponse<WishlistItem>>(`/api/v1/wishlists/${wishlistId}/items`, {
        ...data,
        neededByDate: data.neededByDate?.toISOString(),
      });
      return response.data;
    },

    // Update wishlist item
    update: async (itemId: string, data: {
      desiredQuantity?: number;
      targetPrice?: number;
      priority?: WishlistItem['priority'];
      neededByDate?: Date;
      notes?: string;
      businessJustification?: string;
    }): Promise<APIResponse<WishlistItem>> => {
      const response = await apiClient.patch<APIResponse<WishlistItem>>(`/api/v1/wishlist-items/${itemId}`, {
        ...data,
        neededByDate: data.neededByDate?.toISOString(),
      });
      return response.data;
    },

    // Remove item from wishlist
    remove: async (itemId: string): Promise<APIResponse<{ success: boolean }>> => {
      const response = await apiClient.delete<APIResponse<{ success: boolean }>>(`/api/v1/wishlist-items/${itemId}`);
      return response.data;
    },

    // Move item to cart
    moveToCart: async (itemId: string, cartId?: string): Promise<APIResponse<{
      cartItem: CartItem;
      removedFromWishlist: boolean;
    }>> => {
      const response = await apiClient.post<APIResponse<any>>(`/api/v1/wishlist-items/${itemId}/move-to-cart`, {
        cartId,
      });
      return response.data;
    },

    // Check price alerts
    checkPriceAlerts: async (wishlistId: string): Promise<APIResponse<Array<{
      itemId: string;
      currentPrice: number;
      targetPrice: number;
      priceDropPercentage: number;
    }>>> => {
      const response = await apiClient.get<APIResponse<any>>(`/api/v1/wishlists/${wishlistId}/price-alerts`);
      return response.data;
    },
  },
};

export default { cartAPI, wishlistAPI };

// Export types for index.ts compatibility
export type { Cart, CartItem, Wishlist, WishlistItem };
export type AddToCartData = {
  productId: string;
  quantity: number;
  price: number;
};
