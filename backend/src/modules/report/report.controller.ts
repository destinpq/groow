import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get sales reports (REQ-064)' })
  async getSalesReports(
    @Query('period') period: string = '7d',
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.reportService.getSalesReports(period, start, end);
  }

  @Get('products')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get product performance reports (REQ-065)' })
  async getProductReports(
    @Query('period') period: string = '30d',
    @Query('categoryId') categoryId?: string,
  ) {
    return this.reportService.getProductReports(period, categoryId);
  }

  @Get('customers')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get customer analytics reports (REQ-066)' })
  async getCustomerReports(
    @Query('period') period: string = '30d',
    @Query('segment') segment?: string,
  ) {
    return this.reportService.getCustomerReports(period, segment);
  }

  @Get('vendors')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get vendor performance reports (REQ-067)' })
  async getVendorReports(
    @Query('period') period: string = '30d',
    @Query('status') status?: string,
  ) {
    return this.reportService.getVendorReports(period, status);
  }

  @Get('rfq')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get RFQ analytics reports (REQ-064)' })
  async getRfqReports(
    @Query('period') period: string = '30d',
    @Query('status') status?: string,
  ) {
    return this.reportService.getRfqReports(period, status);
  }

  @Get('subscriptions')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get subscription reports (REQ-068)' })
  async getSubscriptionReports(
    @Query('period') period: string = '30d',
  ) {
    return this.reportService.getSubscriptionReports(period);
  }

  @Get('categories')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get category performance reports (REQ-069)' })
  async getCategoryReports(
    @Query('period') period: string = '30d',
  ) {
    return this.reportService.getCategoryReports(period);
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get comprehensive dashboard analytics' })
  async getDashboardAnalytics(
    @Query('period') period: string = '7d',
  ) {
    return this.reportService.getDashboardAnalytics(period);
  }

  @Get('recent-activities')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get recent system activities' })
  async getRecentActivities(
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
  ) {
    return this.reportService.getRecentActivities(limit, type);
  }

  @Get('system-health')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get system health metrics' })
  async getSystemHealth() {
    return this.reportService.getSystemHealth();
  }
}