import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CartItem } from '@/modules/customer/entities/cart-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderFilterDto } from './dto/order.dto';
import { OrderStatus, PaymentStatus } from '@/common/enums';
import { NotificationService } from '@/modules/notification/notification.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private notificationService: NotificationService,
  ) {}

  async create(customerId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Get cart items
    const cartItems = await this.cartItemRepository.find({
      where: { id: createOrderDto.cartItemIds as any },
      relations: ['product'],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('No items in cart');
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = 50; // Fixed shipping
    const discount = 0; // TODO: Apply coupon
    const total = subtotal + tax + shippingCost - discount;

    // Create order items
    const items = cartItems.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = this.orderRepository.create({
      customerId,
      orderNumber,
      items,
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      notes: createOrderDto.notes,
      status: OrderStatus.NEW,
      paymentStatus: PaymentStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Clear cart items
    await this.cartItemRepository.remove(cartItems);

    // Send confirmation email
    // await this.notificationService.sendOrderConfirmation(
    //   customer.user.email,
    //   { orderId: savedOrder.orderNumber, total: savedOrder.total }
    // );

    return savedOrder;
  }

  async findAll(filters: OrderFilterDto) {
    const { page = 1, limit = 10, status, customerId, vendorId, search } = filters;

    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer');

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (customerId) {
      query.andWhere('order.customerId = :customerId', { customerId });
    }

    if (search) {
      query.andWhere('order.orderNumber LIKE :search', { search: `%${search}%` });
    }

    query.orderBy('order.createdAt', 'DESC');

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [orders, total] = await query.getManyAndCount();

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'customer.user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['customer', 'customer.user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);

    order.status = updateOrderStatusDto.status;

    if (updateOrderStatusDto.trackingNumber) {
      order.trackingNumber = updateOrderStatusDto.trackingNumber;
    }

    if (updateOrderStatusDto.courierName) {
      order.courierName = updateOrderStatusDto.courierName;
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    return this.orderRepository.save(order);
  }

  async getCustomerOrders(customerId: string, filters: OrderFilterDto) {
    return this.findAll({ ...filters, customerId });
  }

  async getOrdersByStatus(status: OrderStatus) {
    return this.orderRepository.find({
      where: { status },
      relations: ['customer', 'customer.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancelOrder(id: string, customerId: string): Promise<Order> {
    const order = await this.findOne(id);

    if (order.customerId !== customerId) {
      throw new BadRequestException('Unauthorized');
    }

    if (order.status !== OrderStatus.NEW && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Cannot cancel order at this stage');
    }

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async getOrderStats() {
    const totalOrders = await this.orderRepository.count();
    const newOrders = await this.orderRepository.count({ where: { status: OrderStatus.NEW } });
    const deliveredOrders = await this.orderRepository.count({ 
      where: { status: OrderStatus.DELIVERED } 
    });

    const revenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      totalOrders,
      newOrders,
      deliveredOrders,
      totalRevenue: parseFloat(revenue?.total || 0),
    };
  }

  // Enhanced order management methods for all states (REQ-055 to REQ-063)
  
  async getManifestOrders() {
    return this.orderRepository.find({
      where: { status: OrderStatus.MANIFESTED },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDisputedOrders() {
    return this.orderRepository.find({
      where: { status: OrderStatus.DISPUTED },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCancelledOrders() {
    return this.orderRepository.find({
      where: { status: OrderStatus.CANCELLED },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHoldOrders() {
    return this.orderRepository.find({
      where: { status: OrderStatus.HOLD },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReturnRefundOrders() {
    return this.orderRepository.find({
      where: [
        { status: OrderStatus.RETURN_REQUESTED },
        { status: OrderStatus.REFUNDED }
      ],
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async manifestOrder(orderId: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.IN_PROCESS) {
      throw new BadRequestException('Order must be in IN_PROCESS status to manifest');
    }

    order.status = OrderStatus.MANIFESTED;
    order.manifestedAt = new Date();
    
    await this.orderRepository.save(order);
    
    // Send notification
    await this.notificationService.sendOrderStatusUpdate(order.customerId, order.id, OrderStatus.MANIFESTED);
    
    return order;
  }

  async shipOrder(orderId: string, trackingNumber: string, carrierId: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.MANIFESTED) {
      throw new BadRequestException('Order must be manifested before shipping');
    }

    order.trackingNumber = trackingNumber;
    order.carrierId = carrierId;
    order.shippedAt = new Date();
    
    await this.orderRepository.save(order);
    
    // Send tracking notification
    await this.notificationService.sendShippingUpdate(order.customerId, order.id, trackingNumber);
    
    return order;
  }

  async holdOrder(orderId: string, reason: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.HOLD;
    order.holdReason = reason;
    order.heldAt = new Date();
    
    await this.orderRepository.save(order);
    
    await this.notificationService.sendOrderHold(order.customerId, order.id, reason);
    
    return order;
  }

  async disputeOrder(orderId: string, reason: string, description: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.DISPUTED;
    order.disputeReason = reason;
    order.disputeDescription = description;
    order.disputedAt = new Date();
    
    await this.orderRepository.save(order);
    
    await this.notificationService.sendDisputeNotification(order.customerId, order.id, reason);
    
    return order;
  }

  async processReturn(orderId: string, returnReason: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Only delivered orders can be returned');
    }

    order.status = OrderStatus.RETURN_REQUESTED;
    order.returnReason = returnReason;
    order.returnRequestedAt = new Date();
    
    await this.orderRepository.save(order);
    
    await this.notificationService.sendReturnNotification(order.customerId, order.id);
    
    return order;
  }

  async processRefund(orderId: string, refundAmount: number, refundReason: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.REFUNDED;
    order.refundAmount = refundAmount;
    order.refundReason = refundReason;
    order.refundedAt = new Date();
    
    await this.orderRepository.save(order);
    
    // Process actual refund through payment gateway
    // TODO: Integrate with payment service
    
    await this.notificationService.sendRefundNotification(order.customerId, order.id, refundAmount);
    
    return order;
  }

  async getDeliveryTracking(orderId: string) {
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId },
      relations: ['customer'] 
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Mock tracking data - TODO: Integrate with actual logistics APIs
    const trackingEvents = [
      {
        status: 'Order Confirmed',
        timestamp: order.createdAt,
        location: 'Warehouse',
        description: 'Your order has been confirmed and is being prepared'
      },
      {
        status: 'In Process',
        timestamp: order.createdAt,
        location: 'Fulfillment Center',
        description: 'Order is being picked and packed'
      }
    ];

    if (order.manifestedAt) {
      trackingEvents.push({
        status: 'Manifested',
        timestamp: order.manifestedAt,
        location: 'Dispatch Center',
        description: 'Order has been manifested for shipping'
      });
    }

    if (order.shippedAt) {
      trackingEvents.push({
        status: 'Shipped',
        timestamp: order.shippedAt,
        location: 'Transit',
        description: `Package shipped with tracking number: ${order.trackingNumber}`
      });
    }

    return {
      order,
      trackingEvents,
      estimatedDelivery: this.calculateEstimatedDelivery(order.shippedAt),
    };
  }

  private calculateEstimatedDelivery(shippedAt: Date): Date {
    if (!shippedAt) return null;
    
    const delivery = new Date(shippedAt);
    delivery.setDate(delivery.getDate() + 3); // 3 days standard delivery
    return delivery;
  }

  async getOrderAnalytics(period: string = '30d') {
    const dateRange = this.getDateRange(period);
    
    // Order status distribution
    const statusDistribution = await this.orderRepository
      .createQueryBuilder('order')
      .select(['order.status as status', 'COUNT(*) as count'])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('order.status')
      .getRawMany();

    // Daily order volume
    const dailyOrders = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'DATE(order.createdAt) as date',
        'COUNT(*) as orders',
        'SUM(order.total) as revenue'
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Top customers by order count
    const topCustomers = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.customer', 'customer')
      .leftJoin('customer.user', 'user')
      .select([
        'user.firstName as firstName',
        'user.lastName as lastName',
        'COUNT(*) as orderCount',
        'SUM(order.total) as totalSpent'
      ])
      .where('order.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('customer.id, user.firstName, user.lastName')
      .orderBy('orderCount', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      statusDistribution,
      dailyOrders,
      topCustomers,
      summary: {
        totalOrders: dailyOrders.reduce((sum, day) => sum + parseInt(day.orders || 0), 0),
        totalRevenue: dailyOrders.reduce((sum, day) => sum + parseFloat(day.revenue || 0), 0),
        avgOrderValue: dailyOrders.length > 0 ? 
          dailyOrders.reduce((sum, day) => sum + parseFloat(day.revenue || 0), 0) / 
          dailyOrders.reduce((sum, day) => sum + parseInt(day.orders || 0), 0) : 0,
      }
    };
  }

  private getDateRange(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
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
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start: startDate, end: now };
  }
}
