import { api } from './client';

// Returns Management API Integration
// Uses order endpoints and extends functionality for returns

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  reason: 'damaged' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'defective' | 'other';
  reasonDescription: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  items: ReturnItem[];
  refundAmount: number;
  refundMethod: 'original_payment' | 'store_credit' | 'exchange';
  images: string[];
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  processedBy?: string;
  trackingNumber?: string;
  estimatedProcessingDays: number;
}

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  originalPrice: number;
  refundAmount: number;
  condition: 'new' | 'used' | 'damaged';
  reason: string;
}

export interface ReturnPolicy {
  id: string;
  title: string;
  content: string;
  returnPeriodDays: number;
  conditions: string[];
  eligibleCategories: string[];
  refundMethods: string[];
  processingTimeDays: number;
  isActive: boolean;
  lastUpdated: string;
}

export interface ReturnStats {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  rejectedReturns: number;
  completedReturns: number;
  totalRefundAmount: number;
  averageProcessingDays: number;
  returnRate: number;
}

// Returns API Service
export const returnsAPI = {
  // Get customer's return requests
  getCustomerReturns: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    orderId?: string;
  } = {}) => {
    try {
      // For now, return mock data since backend doesn't have return endpoints
      // In production, this would call /orders/returns or /returns
      
      const mockReturns: ReturnRequest[] = [
        {
          id: '1',
          orderId: 'ORD-001',
          orderNumber: 'ORD-001',
          customerId: 'customer1',
          customerName: 'John Doe',
          customerEmail: 'customer1@groow.com',
          reason: 'damaged',
          reasonDescription: 'Product arrived damaged during shipping',
          status: 'pending',
          items: [
            {
              id: '1',
              productId: 'prod1',
              productName: 'Sample Product',
              productImage: '/images/product1.jpg',
              sku: 'SKU-001',
              quantity: 1,
              originalPrice: 99.99,
              refundAmount: 99.99,
              condition: 'damaged',
              reason: 'Damaged during shipping'
            }
          ],
          refundAmount: 99.99,
          refundMethod: 'original_payment',
          images: ['/images/damage1.jpg'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedProcessingDays: 5
        }
      ];

      return {
        success: true,
        data: {
          data: mockReturns,
          meta: {
            total: mockReturns.length,
            page: params.page || 1,
            limit: params.limit || 10,
            totalPages: 1
          }
        },
        message: 'Returns retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching returns:', error);
      return {
        success: false,
        data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
        message: 'Failed to fetch returns'
      };
    }
  },

  // Create new return request
  createReturnRequest: async (returnData: {
    orderId: string;
    reason: string;
    reasonDescription: string;
    items: Array<{
      productId: string;
      quantity: number;
      condition: string;
      reason: string;
    }>;
    refundMethod: string;
    images?: string[];
  }) => {
    try {
      // This would call the backend to create a return request
      // For now, return success with mock data
      
      const newReturn: ReturnRequest = {
        id: Date.now().toString(),
        orderId: returnData.orderId,
        orderNumber: `ORD-${returnData.orderId}`,
        customerId: 'current-user',
        customerName: 'Current User',
        customerEmail: 'user@groow.com',
        reason: returnData.reason as any,
        reasonDescription: returnData.reasonDescription,
        status: 'pending',
        items: returnData.items.map((item, index) => ({
          id: (index + 1).toString(),
          productId: item.productId,
          productName: 'Product Name',
          productImage: '/images/product.jpg',
          sku: `SKU-${item.productId}`,
          quantity: item.quantity,
          originalPrice: 99.99,
          refundAmount: 99.99 * item.quantity,
          condition: item.condition as any,
          reason: item.reason
        })),
        refundAmount: 99.99 * returnData.items.reduce((sum, item) => sum + item.quantity, 0),
        refundMethod: returnData.refundMethod as any,
        images: returnData.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedProcessingDays: 5
      };

      return {
        success: true,
        data: newReturn,
        message: 'Return request created successfully'
      };
    } catch (error) {
      console.error('Error creating return request:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to create return request'
      };
    }
  },

  // Get return policy
  getReturnPolicy: async () => {
    try {
      const policy: ReturnPolicy = {
        id: '1',
        title: 'Return & Refund Policy',
        content: `
          <h3>Return Policy Overview</h3>
          <p>We offer a 30-day return policy for most items. Returns must be in original condition with tags attached.</p>
          
          <h4>Eligible Items</h4>
          <ul>
            <li>Items must be unused and in original condition</li>
            <li>Items must be returned within 30 days of purchase</li>
            <li>Original packaging and tags must be included</li>
          </ul>
          
          <h4>Non-Returnable Items</h4>
          <ul>
            <li>Personalized or customized items</li>
            <li>Perishable goods</li>
            <li>Digital downloads</li>
            <li>Gift cards</li>
          </ul>
        `,
        returnPeriodDays: 30,
        conditions: [
          'Items must be unused and in original condition',
          'Original packaging required',
          'Tags must be attached',
          'Return within 30 days of purchase'
        ],
        eligibleCategories: ['clothing', 'electronics', 'home', 'books'],
        refundMethods: ['Original Payment Method', 'Store Credit', 'Exchange'],
        processingTimeDays: 5,
        isActive: true,
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        data: policy,
        message: 'Return policy retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching return policy:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to fetch return policy'
      };
    }
  },

  // Get return statistics
  getReturnStats: async () => {
    try {
      const stats: ReturnStats = {
        totalReturns: 156,
        pendingReturns: 23,
        approvedReturns: 98,
        rejectedReturns: 12,
        completedReturns: 98,
        totalRefundAmount: 15467.89,
        averageProcessingDays: 4.2,
        returnRate: 3.8
      };

      return {
        success: true,
        data: stats,
        message: 'Return statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching return stats:', error);
      return {
        success: false,
        data: {
          totalReturns: 0,
          pendingReturns: 0,
          approvedReturns: 0,
          rejectedReturns: 0,
          completedReturns: 0,
          totalRefundAmount: 0,
          averageProcessingDays: 0,
          returnRate: 0
        },
        message: 'Failed to fetch return statistics'
      };
    }
  },

  // Get eligible orders for returns
  getEligibleOrders: async () => {
    try {
      // This would check orders that are eligible for returns (recent, delivered, etc.)
      const response = await api.get('/orders/my-orders', {
        params: { status: 'delivered', limit: 50 }
      });

      // Filter orders within return period (30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const eligibleOrders = (response.data?.data || []).filter((order: any) => 
        new Date(order.deliveredAt || order.createdAt) > thirtyDaysAgo
      );

      return {
        success: true,
        data: eligibleOrders,
        message: 'Eligible orders retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching eligible orders:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch eligible orders'
      };
    }
  },

  // Track return status
  trackReturn: async (returnId: string) => {
    try {
      // Mock return tracking data
      const trackingData = {
        returnId,
        status: 'processing',
        timeline: [
          {
            status: 'submitted',
            timestamp: '2025-11-01T10:00:00Z',
            description: 'Return request submitted'
          },
          {
            status: 'approved',
            timestamp: '2025-11-02T14:30:00Z',
            description: 'Return request approved'
          },
          {
            status: 'processing',
            timestamp: '2025-11-05T09:15:00Z',
            description: 'Return package received and being processed'
          }
        ],
        estimatedCompletion: '2025-11-08T17:00:00Z'
      };

      return {
        success: true,
        data: trackingData,
        message: 'Return tracking retrieved successfully'
      };
    } catch (error) {
      console.error('Error tracking return:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to track return'
      };
    }
  }
};

export default returnsAPI;