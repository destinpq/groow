import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { VendorPayout } from './entities/vendor-payout.entity';
import { Refund } from './entities/refund.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { TransactionType } from '@/common/enums';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(VendorPayout)
    private vendorPayoutRepository: Repository<VendorPayout>,
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Transaction History and Reporting (REQ-077)
  async getTransactions(filters: any) {
    const { page, limit, type, status, startDate, endDate } = filters;
    
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .leftJoinAndSelect('transaction.order', 'order');

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('transaction.status = :status', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    const [transactions, total] = await queryBuilder
      .orderBy('transaction.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionStats(period: string) {
    const dateRange = this.getDateRange(period);
    
    const stats = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select([
        'COUNT(*) as totalTransactions',
        'SUM(CASE WHEN transaction.type = :credit THEN transaction.amount ELSE 0 END) as totalCredits',
        'SUM(CASE WHEN transaction.type = :debit THEN transaction.amount ELSE 0 END) as totalDebits',
        'COUNT(CASE WHEN transaction.status = :completed THEN 1 END) as completedTransactions',
        'COUNT(CASE WHEN transaction.status = :failed THEN 1 END) as failedTransactions',
      ])
      .where('transaction.createdAt BETWEEN :start AND :end', dateRange)
      .setParameters({
        credit: TransactionType.CREDIT,
        debit: TransactionType.DEBIT,
        completed: 'completed',
        failed: 'failed',
      })
      .getRawOne();

    const dailyStats = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select([
        'DATE(transaction.createdAt) as date',
        'COUNT(*) as transactionCount',
        'SUM(transaction.amount) as totalAmount',
      ])
      .where('transaction.createdAt BETWEEN :start AND :end', dateRange)
      .groupBy('DATE(transaction.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      success: true,
      data: {
        summary: stats,
        dailyStats,
        netFlow: parseFloat(stats.totalCredits || 0) - parseFloat(stats.totalDebits || 0),
      },
    };
  }

  // Vendor Payout Management (REQ-078)
  async getPayouts(filters: any) {
    const { page, limit, status, vendorId } = filters;
    
    const queryBuilder = this.vendorPayoutRepository.createQueryBuilder('payout')
      .leftJoinAndSelect('payout.vendor', 'vendor')
      .leftJoinAndSelect('vendor.user', 'user');

    if (status) {
      queryBuilder.andWhere('payout.status = :status', { status });
    }

    if (vendorId) {
      queryBuilder.andWhere('payout.vendorId = :vendorId', { vendorId });
    }

    const [payouts, total] = await queryBuilder
      .orderBy('payout.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: payouts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async processVendorPayout(vendorId: string, amount: number, notes?: string) {
    // Calculate commission (assume 10% platform fee)
    const commission = amount * 0.10;
    const netAmount = amount - commission;

    const payout = this.vendorPayoutRepository.create({
      vendorId,
      amount,
      commission,
      netAmount,
      status: 'processing',
      payoutMethod: 'bank_transfer', // Default method
      notes,
    });

    await this.vendorPayoutRepository.save(payout);

    // TODO: Integrate with actual payment gateway for payout
    // For now, simulate processing
    setTimeout(async () => {
      payout.status = 'completed';
      payout.processedAt = new Date();
      payout.transactionReference = `PAY-${Date.now()}`;
      await this.vendorPayoutRepository.save(payout);
    }, 5000); // Simulate 5-second processing

    return {
      success: true,
      data: payout,
      message: 'Payout initiated successfully',
    };
  }

  async getPendingPayouts() {
    const payouts = await this.vendorPayoutRepository.find({
      where: { status: 'pending' },
      relations: ['vendor', 'vendor.user'],
      order: { createdAt: 'ASC' },
    });

    const totalPending = payouts.reduce((sum, payout) => sum + parseFloat(payout.netAmount.toString()), 0);

    return {
      success: true,
      data: {
        payouts,
        totalPending,
        count: payouts.length,
      },
    };
  }

  async getVendorEarnings(vendorId: string, period: string) {
    const dateRange = this.getDateRange(period);
    
    // Get completed orders for this vendor
    const earnings = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .select([
        'COUNT(DISTINCT order.id) as orderCount',
        'SUM(item.total) as grossEarnings',
        'SUM(item.total * 0.9) as netEarnings', // After 10% commission
      ])
      .where('product.vendorId = :vendorId', { vendorId })
      .andWhere('order.status = :status', { status: 'delivered' })
      .andWhere('order.createdAt BETWEEN :start AND :end', dateRange)
      .getRawOne();

    // Get payout history
    const payoutHistory = await this.vendorPayoutRepository.find({
      where: { 
        vendorId,
        status: 'completed',
      },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const totalPayouts = payoutHistory.reduce((sum, payout) => 
      sum + parseFloat(payout.netAmount.toString()), 0);

    return {
      success: true,
      data: {
        earnings,
        payoutHistory,
        pendingAmount: parseFloat(earnings.netEarnings || 0) - totalPayouts,
        commission: parseFloat(earnings.grossEarnings || 0) - parseFloat(earnings.netEarnings || 0),
      },
    };
  }

  // Refund Processing (REQ-079)
  async getRefunds(filters: any) {
    const { page, limit, status } = filters;
    
    const queryBuilder = this.refundRepository.createQueryBuilder('refund')
      .leftJoinAndSelect('refund.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user');

    if (status) {
      queryBuilder.andWhere('refund.status = :status', { status });
    }

    const [refunds, total] = await queryBuilder
      .orderBy('refund.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      data: refunds,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async processRefund(orderId: string, amount: number, reason: string, refundMethod: string, notes?: string) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (amount > order.total) {
      throw new BadRequestException('Refund amount cannot exceed order total');
    }

    const refund = this.refundRepository.create({
      orderId,
      amount,
      reason,
      status: 'processing',
      refundMethod,
      notes,
    });

    await this.refundRepository.save(refund);

    // TODO: Integrate with actual payment gateway for refund processing
    // For now, simulate processing
    setTimeout(async () => {
      refund.status = 'completed';
      refund.processedAt = new Date();
      refund.gatewayRefundId = `REF-${Date.now()}`;
      await this.refundRepository.save(refund);

      // Update order status
      order.status = 'refunded' as any;
      await this.orderRepository.save(order);
    }, 3000); // Simulate 3-second processing

    return {
      success: true,
      data: refund,
      message: 'Refund initiated successfully',
    };
  }

  async getPendingRefunds() {
    const refunds = await this.refundRepository.find({
      where: { status: 'pending' },
      relations: ['order', 'order.customer', 'order.customer.user'],
      order: { createdAt: 'ASC' },
    });

    const totalPending = refunds.reduce((sum, refund) => sum + parseFloat(refund.amount.toString()), 0);

    return {
      success: true,
      data: {
        refunds,
        totalPending,
        count: refunds.length,
      },
    };
  }

  async getFinanceDashboard(period: string) {
    const dateRange = this.getDateRange(period);
    
    // Get financial summary
    const [transactionStats, payoutStats, refundStats] = await Promise.all([
      this.getTransactionStats(period),
      this.getPayoutSummary(dateRange),
      this.getRefundSummary(dateRange),
    ]);

    return {
      success: true,
      data: {
        transactions: transactionStats.data,
        payouts: payoutStats,
        refunds: refundStats,
        netRevenue: transactionStats.data.netFlow - payoutStats.totalPayouts - refundStats.totalRefunds,
      },
    };
  }

  private async getPayoutSummary(dateRange: any) {
    const stats = await this.vendorPayoutRepository
      .createQueryBuilder('payout')
      .select([
        'COUNT(*) as totalPayouts',
        'SUM(payout.netAmount) as totalAmount',
        'COUNT(CASE WHEN payout.status = :pending THEN 1 END) as pendingPayouts',
      ])
      .where('payout.createdAt BETWEEN :start AND :end', dateRange)
      .setParameter('pending', 'pending')
      .getRawOne();

    return {
      totalPayouts: parseFloat(stats.totalAmount || 0),
      payoutCount: parseInt(stats.totalPayouts || 0),
      pendingCount: parseInt(stats.pendingPayouts || 0),
    };
  }

  private async getRefundSummary(dateRange: any) {
    const stats = await this.refundRepository
      .createQueryBuilder('refund')
      .select([
        'COUNT(*) as totalRefunds',
        'SUM(refund.amount) as totalAmount',
        'COUNT(CASE WHEN refund.status = :pending THEN 1 END) as pendingRefunds',
      ])
      .where('refund.createdAt BETWEEN :start AND :end', dateRange)
      .setParameter('pending', 'pending')
      .getRawOne();

    return {
      totalRefunds: parseFloat(stats.totalAmount || 0),
      refundCount: parseInt(stats.totalRefunds || 0),
      pendingCount: parseInt(stats.pendingRefunds || 0),
    };
  }

  async getReconciliation(date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const [transactions, payouts, refunds] = await Promise.all([
      this.transactionRepository.find({
        where: {
          createdAt: Between(startOfDay, endOfDay),
          status: 'completed',
        },
      }),
      this.vendorPayoutRepository.find({
        where: {
          processedAt: Between(startOfDay, endOfDay),
          status: 'completed',
        },
      }),
      this.refundRepository.find({
        where: {
          processedAt: Between(startOfDay, endOfDay),
          status: 'completed',
        },
      }),
    ]);

    const summary = {
      totalCredits: transactions
        .filter(t => t.type === TransactionType.CREDIT)
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
      totalDebits: transactions
        .filter(t => t.type === TransactionType.DEBIT)
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
      totalPayouts: payouts.reduce((sum, p) => sum + parseFloat(p.netAmount.toString()), 0),
      totalRefunds: refunds.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0),
    };

    return {
      success: true,
      data: {
        date: targetDate,
        summary,
        details: {
          transactions,
          payouts,
          refunds,
        },
        reconciled: true, // TODO: Add actual reconciliation logic
      },
    };
  }

  async createSettlement(vendorIds: string[], settlementDate: string, notes?: string) {
    const settlements = [];
    
    for (const vendorId of vendorIds) {
      const earnings = await this.getVendorEarnings(vendorId, '30d');
      
      if (earnings.data.pendingAmount > 0) {
        const settlement = await this.processVendorPayout(
          vendorId,
          earnings.data.pendingAmount,
          notes
        );
        settlements.push(settlement.data);
      }
    }

    return {
      success: true,
      data: settlements,
      message: `Settlement created for ${settlements.length} vendors`,
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