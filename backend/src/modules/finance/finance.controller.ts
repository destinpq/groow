import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('transactions')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get transaction history and reporting (REQ-077)' })
  async getTransactions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financeService.getTransactions({
      page: Number(page),
      limit: Number(limit),
      type,
      status,
      startDate,
      endDate,
    });
  }

  @Get('transactions/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get transaction statistics' })
  async getTransactionStats(
    @Query('period') period: string = '30d',
  ) {
    return this.financeService.getTransactionStats(period);
  }

  @Get('payouts')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get vendor payout management (REQ-078)' })
  async getPayouts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('vendorId') vendorId?: string,
  ) {
    return this.financeService.getPayouts({
      page: Number(page),
      limit: Number(limit),
      status,
      vendorId,
    });
  }

  @Post('payouts/:vendorId/process')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process vendor payout' })
  async processVendorPayout(
    @Param('vendorId') vendorId: string,
    @Body() payoutData: { amount: number; notes?: string },
  ) {
    return this.financeService.processVendorPayout(vendorId, payoutData.amount, payoutData.notes);
  }

  @Get('payouts/pending')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get pending vendor payouts' })
  async getPendingPayouts() {
    return this.financeService.getPendingPayouts();
  }

  @Get('vendor/:vendorId/earnings')
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor earnings summary' })
  async getVendorEarnings(
    @Param('vendorId') vendorId: string,
    @Query('period') period: string = '30d',
  ) {
    return this.financeService.getVendorEarnings(vendorId, period);
  }

  @Get('refunds')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get refund processing (REQ-079)' })
  async getRefunds(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
  ) {
    return this.financeService.getRefunds({
      page: Number(page),
      limit: Number(limit),
      status,
    });
  }

  @Post('refunds/:orderId/process')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process order refund' })
  async processRefund(
    @Param('orderId') orderId: string,
    @Body() refundData: { 
      amount: number; 
      reason: string; 
      refundMethod: string;
      notes?: string;
    },
  ) {
    return this.financeService.processRefund(
      orderId, 
      refundData.amount, 
      refundData.reason,
      refundData.refundMethod,
      refundData.notes
    );
  }

  @Get('refunds/pending')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get pending refunds' })
  async getPendingRefunds() {
    return this.financeService.getPendingRefunds();
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get finance dashboard overview' })
  async getFinanceDashboard(
    @Query('period') period: string = '30d',
  ) {
    return this.financeService.getFinanceDashboard(period);
  }

  @Get('reconciliation')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get payment reconciliation data' })
  async getReconciliation(
    @Query('date') date?: string,
  ) {
    return this.financeService.getReconciliation(date);
  }

  @Post('settlements')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create settlement for vendors' })
  async createSettlement(
    @Body() settlementData: {
      vendorIds: string[];
      settlementDate: string;
      notes?: string;
    },
  ) {
    return this.financeService.createSettlement(
      settlementData.vendorIds,
      settlementData.settlementDate,
      settlementData.notes
    );
  }
}