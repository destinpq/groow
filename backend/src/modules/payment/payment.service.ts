import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Payment } from './entities/payment.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { Vendor } from '@/modules/auth/entities/vendor.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { CreatePaymentDto, VerifyPaymentDto, PaymentFilterDto } from './dto/payment.dto';
import { PaymentStatus, PaymentMethod, TransactionType } from '@/common/enums';

@Injectable()
export class PaymentService {
  private razorpayKey: string;
  private razorpaySecret: string;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private configService: ConfigService,
  ) {
    this.razorpayKey = this.configService.get('RAZORPAY_KEY_ID');
    this.razorpaySecret = this.configService.get('RAZORPAY_KEY_SECRET');
  }

  async initiatePayment(userId: string, createPaymentDto: CreatePaymentDto): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: createPaymentDto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const transactionId = `PAY-${Date.now()}`;

    // Create payment record
    const payment = this.paymentRepository.create({
      transactionId,
      orderId: createPaymentDto.orderId,
      userId,
      amount: createPaymentDto.amount,
      paymentMethod: createPaymentDto.paymentMethod,
      status: PaymentStatus.PENDING,
    });

    await this.paymentRepository.save(payment);

    // For COD, mark as completed
    if (createPaymentDto.paymentMethod === PaymentMethod.COD) {
      payment.status = PaymentStatus.COMPLETED;
      payment.paidAt = new Date();
      await this.paymentRepository.save(payment);

      return {
        paymentId: payment.id,
        transactionId: payment.transactionId,
        status: 'completed',
        method: 'COD',
      };
    }

    // For online payments, create Razorpay order
    const razorpayOrder = {
      orderId: `razorpay_${transactionId}`,
      amount: createPaymentDto.amount * 100, // Convert to paise
      currency: 'INR',
      key: this.razorpayKey,
    };

    payment.gatewayTransactionId = razorpayOrder.orderId;
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      transactionId: payment.transactionId,
      razorpayOrderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: razorpayOrder.key,
    };
  }

  async verifyPayment(paymentId: string, verifyPaymentDto: VerifyPaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify Razorpay signature
    const signature = crypto
      .createHmac('sha256', this.razorpaySecret)
      .update(`${payment.gatewayTransactionId}|${verifyPaymentDto.gatewayTransactionId}`)
      .digest('hex');

    if (signature !== verifyPaymentDto.signature) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Invalid signature';
      await this.paymentRepository.save(payment);
      throw new BadRequestException('Payment verification failed');
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    payment.gatewayResponse = JSON.stringify(verifyPaymentDto);
    
    return this.paymentRepository.save(payment);
  }

  async getPaymentHistory(filters: PaymentFilterDto) {
    const { page = 1, limit = 10, userId, status } = filters;

    const query = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('payment.user', 'user');

    if (userId) {
      query.andWhere('payment.userId = :userId', { userId });
    }

    if (status) {
      query.andWhere('payment.status = :status', { status });
    }

    query.orderBy('payment.createdAt', 'DESC');

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [payments, total] = await query.getManyAndCount();

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Wallet Methods
  async getWalletBalance(vendorId?: string, customerId?: string): Promise<number> {
    if (vendorId) {
      const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
      return vendor?.walletBalance || 0;
    }

    if (customerId) {
      const customer = await this.customerRepository.findOne({ where: { id: customerId } });
      return customer?.walletBalance || 0;
    }

    return 0;
  }

  async addToWallet(
    vendorId: string | null,
    customerId: string | null,
    amount: number,
    description: string,
    referenceId?: string,
  ): Promise<WalletTransaction> {
    const currentBalance = await this.getWalletBalance(vendorId, customerId);
    const newBalance = currentBalance + amount;

    const transactionId = `WALLET-${Date.now()}`;

    const transaction = this.walletTransactionRepository.create({
      transactionId,
      vendorId,
      customerId,
      type: TransactionType.CREDIT,
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description,
      referenceId,
    });

    await this.walletTransactionRepository.save(transaction);

    // Update wallet balance
    if (vendorId) {
      await this.vendorRepository.update(vendorId, { walletBalance: newBalance });
    } else if (customerId) {
      await this.customerRepository.update(customerId, { walletBalance: newBalance });
    }

    return transaction;
  }

  async deductFromWallet(
    vendorId: string | null,
    customerId: string | null,
    amount: number,
    description: string,
    referenceId?: string,
  ): Promise<WalletTransaction> {
    const currentBalance = await this.getWalletBalance(vendorId, customerId);

    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    const newBalance = currentBalance - amount;
    const transactionId = `WALLET-${Date.now()}`;

    const transaction = this.walletTransactionRepository.create({
      transactionId,
      vendorId,
      customerId,
      type: TransactionType.DEBIT,
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description,
      referenceId,
    });

    await this.walletTransactionRepository.save(transaction);

    // Update wallet balance
    if (vendorId) {
      await this.vendorRepository.update(vendorId, { walletBalance: newBalance });
    } else if (customerId) {
      await this.customerRepository.update(customerId, { walletBalance: newBalance });
    }

    return transaction;
  }

  async getWalletTransactions(vendorId?: string, customerId?: string) {
    const query = this.walletTransactionRepository.createQueryBuilder('transaction');

    if (vendorId) {
      query.where('transaction.vendorId = :vendorId', { vendorId });
    } else if (customerId) {
      query.where('transaction.customerId = :customerId', { customerId });
    }

    query.orderBy('transaction.createdAt', 'DESC');

    return query.getMany();
  }
}
