import { Controller, Get, Post, Put, Delete, Patch, Query, Param, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MarketingService } from '@/modules/marketing/marketing.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';
import { GetDealsDto } from './dto/marketing-query.dto';

@ApiTags('Deals')
@ApiBearerAuth()
@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealsController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  async getAllDeals(@Query() filters: GetDealsDto) {
    return this.marketingService.getAllDeals(filters);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get deals statistics' })
  async getDealsStats() {
    return this.marketingService.getDealsStats();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active deals' })
  async getActiveDeals(@Query() filters: any) {
    // Note: Service method doesn't use filters yet - ignoring for now
    return this.marketingService.getActiveDeals();
  }

  @Get('performance-report')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get deals performance report' })
  async getPerformanceReport(@Query() dateRange: any) {
    return this.marketingService.getDealsPerformanceReport(dateRange);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending deals' })
  async getTrendingDeals(@Query() options: any) {
    return this.marketingService.getTrendingDeals(options);
  }

  @Get('best-for-user/:userId')
  @ApiOperation({ summary: 'Get best deals for user' })
  async getBestDealsForUser(@Param('userId') userId: string, @Query() options: any) {
    return this.marketingService.getBestDealsForUser(userId, options);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get deal by ID' })
  async getDealById(@Param('id') id: string) {
    return this.marketingService.getDealById(id);
  }

  @Get(':id/analytics')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get deal analytics' })
  async getDealAnalytics(@Param('id') id: string, @Query() dateRange: any) {
    // Note: Service method doesn't use dateRange yet - ignoring for now
    return this.marketingService.getDealAnalytics(id);
  }

  @Get(':dealId/usage')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get deal usage' })
  async getDealUsage(@Param('dealId') dealId: string, @Query() filters: any) {
    return this.marketingService.getDealUsage(dealId, filters);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new deal' })
  async createDeal(@Body() data: any, @CurrentUser() user: any) {
    return this.marketingService.createDeal(data, user.id);
  }

  @Post('bulk-delete')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Bulk delete deals' })
  async bulkDeleteDeals(@Body() body: { ids: string[] }) {
    return this.marketingService.bulkDeleteDeals(body.ids);
  }

  @Post('bulk-update-status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Bulk update deal status' })
  async bulkUpdateStatus(@Body() body: { ids: string[]; status: boolean }) {
    return this.marketingService.bulkUpdateDealStatus(body.ids, body.status);
  }

  @Post(':id/duplicate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Duplicate deal' })
  async duplicateDeal(@Param('id') id: string) {
    return this.marketingService.duplicateDeal(id);
  }

  @Post(':dealId/check-eligibility')
  @ApiOperation({ summary: 'Check deal eligibility' })
  async checkDealEligibility(@Param('dealId') dealId: string, @Body() body: any) {
    return this.marketingService.checkDealEligibility(dealId, body);
  }

  @Post(':dealId/apply')
  @ApiOperation({ summary: 'Apply deal' })
  async applyDeal(@Param('dealId') dealId: string, @Body() body: any) {
    return this.marketingService.applyDeal(dealId, body);
  }

  @Post(':dealId/track-click')
  @ApiOperation({ summary: 'Track deal click' })
  async trackDealClick(@Param('dealId') dealId: string, @Body() body: any) {
    return this.marketingService.trackDealClick(dealId, body);
  }

  @Post(':dealId/upload-banner')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload deal banner' })
  async uploadDealBanner(@Param('dealId') dealId: string, @UploadedFile() file: any) {
    return this.marketingService.uploadDealBanner(dealId, file);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update deal' })
  async updateDeal(@Param('id') id: string, @Body() data: any) {
    return this.marketingService.updateDeal(id, data);
  }

  @Patch(':id/toggle-status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle deal status' })
  async toggleDealStatus(@Param('id') id: string) {
    return this.marketingService.toggleDealStatus(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete deal' })
  async deleteDeal(@Param('id') id: string) {
    return this.marketingService.deleteDeal(id);
  }
}