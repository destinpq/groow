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
}
