import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Order } from '@/modules/order/entities/order.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { OrderStatus, UserRole } from '@/common/enums';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getSalesReports(period: string, start?: string, end?: string) {
    const dateRange = this.getDateRange(period, start, end);
    
    // Sales trends
    const salesData = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'DATE(order.createdAt) as date',
        'COUNT(*) as orders',
        'SUM(order.total) as revenue',
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Top performing products
    const topProducts = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .select([
        'product.name as productName',
        'SUM(item.quantity) as totalSold',
        'SUM(item.total) as revenue',
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('product.id, product.name')
      .orderBy('revenue', 'DESC')
      .limit(10)
      .getRawMany();

    // Order status breakdown
    const statusBreakdown = await this.orderRepository
      .createQueryBuilder('order')
      .select(['order.status as status', 'COUNT(*) as count'])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('order.status')
      .getRawMany();

    return {
      success: true,
      data: {
        salesTrends: salesData,
        topProducts,
        statusBreakdown,
        summary: {
          totalRevenue: salesData.reduce((sum, day) => sum + parseFloat(day.revenue || 0), 0),
          totalOrders: salesData.reduce((sum, day) => sum + parseInt(day.orders || 0), 0),
          averageOrderValue: salesData.length > 0 ? 
            salesData.reduce((sum, day) => sum + parseFloat(day.revenue || 0), 0) / 
            salesData.reduce((sum, day) => sum + parseInt(day.orders || 0), 0) : 0,
        },
      },
    };
  }

  async getProductReports(period: string, categoryId?: string) {
    const dateRange = this.getDateRange(period);
    
    // Product performance
    const productPerformance = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.category', 'category')
      .select([
        'product.id as productId',
        'product.name as productName',
        'category.name as categoryName',
        'COUNT(DISTINCT order.id) as orderCount',
        'SUM(item.quantity) as totalSold',
        'SUM(item.total) as revenue',
        'AVG(product.rating) as avgRating',
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .andWhere(categoryId ? 'category.id = :categoryId' : '1=1', { categoryId })
      .groupBy('product.id, product.name, category.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    // Category distribution
    const categoryDistribution = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.category', 'category')
      .select([
        'category.name as categoryName',
        'COUNT(*) as productCount',
        'SUM(item.total) as revenue',
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('category.id, category.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    return {
      success: true,
      data: {
        productPerformance,
        categoryDistribution,
        topPerformers: productPerformance.slice(0, 10),
        underPerformers: productPerformance.slice(-10).reverse(),
      },
    };
  }

  async getCustomerReports(period: string, segment?: string) {
    const dateRange = this.getDateRange(period);
    
    // Customer acquisition
    const customerAcquisition = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'DATE(user.createdAt) as date',
        'COUNT(*) as newCustomers',
      ])
      .where('user.role = :role', { role: UserRole.CUSTOMER })
      .andWhere('user.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('DATE(user.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Customer lifetime value
    const customerLTV = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.customer', 'customer')
      .select([
        'customer.id as customerId',
        'customer.name as customerName',
        'COUNT(*) as orderCount',
        'SUM(order.total) as totalSpent',
        'AVG(order.total) as avgOrderValue',
        'MIN(order.createdAt) as firstOrder',
        'MAX(order.createdAt) as lastOrder',
      ])
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .groupBy('customer.id, customer.name')
      .orderBy('totalSpent', 'DESC')
      .limit(100)
      .getRawMany();

    return {
      success: true,
      data: {
        customerAcquisition,
        topCustomers: customerLTV.slice(0, 20),
        customerSegments: this.segmentCustomers(customerLTV),
        summary: {
          totalCustomers: await this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
          newCustomers: customerAcquisition.reduce((sum, day) => sum + parseInt(day.newCustomers || 0), 0),
          avgLifetimeValue: customerLTV.length > 0 ? 
            customerLTV.reduce((sum, customer) => sum + parseFloat(customer.totalSpent || 0), 0) / customerLTV.length : 0,
        },
      },
    };
  }

  async getVendorReports(period: string, status?: string) {
    const dateRange = this.getDateRange(period);
    
    // Vendor performance
    const vendorPerformance = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.vendor', 'vendor')
      .select([
        'vendor.id as vendorId',
        'vendor.businessName as vendorName',
        'COUNT(DISTINCT order.id) as orderCount',
        'SUM(item.total) as revenue',
        'COUNT(DISTINCT item.productId) as productsCount',
        'AVG(vendor.rating) as avgRating',
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .andWhere(status ? 'vendor.status = :status' : '1=1', { status })
      .groupBy('vendor.id, vendor.businessName')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    return {
      success: true,
      data: {
        vendorPerformance,
        topVendors: vendorPerformance.slice(0, 10),
        summary: {
          totalVendors: await this.userRepository.count({ where: { role: UserRole.VENDOR } }),
          activeVendors: vendorPerformance.length,
          avgRevenue: vendorPerformance.length > 0 ?
            vendorPerformance.reduce((sum, vendor) => sum + parseFloat(vendor.revenue || 0), 0) / vendorPerformance.length : 0,
        },
      },
    };
  }

  async getRfqReports(period: string, status?: string) {
    const dateRange = this.getDateRange(period);
    
    // Mock RFQ data - TODO: Implement actual RFQ entities
    const rfqData = {
      totalRFQs: 245,
      newRFQs: 23,
      quotedRFQs: 187,
      convertedRFQs: 98,
      conversionRate: 40.0,
      avgResponseTime: '2.5 hours',
    };

    return {
      success: true,
      data: rfqData,
    };
  }

  async getSubscriptionReports(period: string) {
    // Mock subscription data - TODO: Implement actual subscription entities
    const subscriptionData = {
      totalSubscriptions: 156,
      activeSubscriptions: 142,
      expiredSubscriptions: 14,
      renewalRate: 85.5,
      avgSubscriptionValue: 299.99,
    };

    return {
      success: true,
      data: subscriptionData,
    };
  }

  async getCategoryReports(period: string) {
    const dateRange = this.getDateRange(period);
    
    // Category performance
    const categoryPerformance = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.category', 'category')
      .select([
        'category.id as categoryId',
        'category.name as categoryName',
        'COUNT(DISTINCT order.id) as orderCount',
        'SUM(item.total) as revenue',
        'COUNT(DISTINCT product.id) as productCount',
        'AVG(product.rating) as avgRating',
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('category.id, category.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    return {
      success: true,
      data: {
        categoryPerformance,
        summary: {
          totalCategories: categoryPerformance.length,
          topCategory: categoryPerformance[0]?.categoryName || 'N/A',
          totalRevenue: categoryPerformance.reduce((sum, cat) => sum + parseFloat(cat.revenue || 0), 0),
        },
      },
    };
  }

  async getDashboardAnalytics(period: string) {
    const dateRange = this.getDateRange(period);
    
    // Get comprehensive dashboard data
    const [salesSummary, userStats, productStats, recentOrders] = await Promise.all([
      this.getSalesReports(period),
      this.getUserStats(),
      this.getProductStats(),
      this.getRecentOrders(10),
    ]);

    return {
      success: true,
      data: {
        salesSummary: salesSummary.data,
        userStats: userStats.data,
        productStats: productStats.data,
        recentOrders: recentOrders.data,
        period,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  async getRecentActivities(limit: number, type?: string) {
    // Get recent activities from different sources
    const recentOrders = await this.orderRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
      take: limit / 2,
    });

    const recentUsers = await this.userRepository.find({
      where: { role: UserRole.CUSTOMER },
      order: { createdAt: 'DESC' },
      take: limit / 2,
    });

    const activities = [
      ...recentOrders.map(order => ({
        id: `order-${order.id}`,
        type: 'order',
        title: `New Order ${order.orderNumber}`,
        description: `Order placed by ${order.customer?.user?.firstName || 'Unknown'} ${order.customer?.user?.lastName || ''}`.trim(),
        amount: order.total,
        timestamp: order.createdAt,
        status: order.status,
      })),
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user',
        title: 'New Customer Registration',
        description: `${user.firstName || ''} ${user.lastName || ''} joined the platform`.trim(),
        timestamp: user.createdAt,
        status: 'success',
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      success: true,
      data: activities.slice(0, limit),
    };
  }

  async getSystemHealth() {
    // Get system health metrics
    const [totalUsers, totalOrders, totalProducts, recentErrors] = await Promise.all([
      this.userRepository.count(),
      this.orderRepository.count(),
      this.productRepository.count(),
      // TODO: Implement error logging table
      Promise.resolve([]),
    ]);

    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      database: {
        status: 'connected',
        users: totalUsers,
        orders: totalOrders,
        products: totalProducts,
      },
      errors: {
        recent: recentErrors.length,
        critical: 0,
      },
      performance: {
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
    };

    return {
      success: true,
      data: health,
    };
  }

  private getDateRange(period: string, start?: string, end?: string) {
    const now = new Date();
    let startDate: Date;
    const endDate = end ? new Date(end) : now;

    if (start) {
      startDate = new Date(start);
    } else {
      switch (period) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }

    return { start: startDate, end: endDate };
  }

  private async getUserStats() {
    const [totalUsers, totalCustomers, totalVendors, totalAdmins] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
      this.userRepository.count({ where: { role: UserRole.VENDOR } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalCustomers,
        totalVendors,
        totalAdmins,
      },
    };
  }

  private async getProductStats() {
    const [totalProducts, activeProducts] = await Promise.all([
      this.productRepository.count(),
      this.productRepository.count({ where: { isActive: true } }),
    ]);

    return {
      success: true,
      data: {
        totalProducts,
        activeProducts,
        featuredProducts: 0, // TODO: Add featured field to Product entity
        inactiveProducts: totalProducts - activeProducts,
      },
    };
  }

  private async getRecentOrders(limit: number) {
    const orders = await this.orderRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return {
      success: true,
      data: orders,
    };
  }

  private segmentCustomers(customers: any[]) {
    const segments = {
      vip: customers.filter(c => parseFloat(c.totalSpent || 0) > 1000),
      regular: customers.filter(c => parseFloat(c.totalSpent || 0) > 100 && parseFloat(c.totalSpent || 0) <= 1000),
      new: customers.filter(c => parseFloat(c.totalSpent || 0) <= 100),
    };

    return {
      vip: segments.vip.length,
      regular: segments.regular.length,
      new: segments.new.length,
    };
  }
}