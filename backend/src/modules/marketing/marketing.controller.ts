import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';
import { MarketingService } from './marketing.service';

@ApiTags('Marketing')
@Controller('marketing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // DEALS MANAGEMENT (REQ-080)
  @Get('deals')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Get all deals with filters' })
  async getAllDeals(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('dealType') dealType?: string,
    @Query('status') status?: string,
    @Query('isActive') isActive?: boolean,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.marketingService.getAllDeals({
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      search,
      dealType,
      status,
      isActive,
      isFeatured,
      startDate,
      endDate,
    });
  }

  @Get('deals/active')
  @ApiResponse({ status: 200, description: 'Get active deals for customers' })
  async getActiveDeals() {
    return this.marketingService.getActiveDeals();
  }

  @Get('deals/featured')
  @ApiResponse({ status: 200, description: 'Get featured deals' })
  async getFeaturedDeals() {
    return this.marketingService.getFeaturedDeals();
  }

  @Get('deals/:id')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get deal by ID' })
  async getDealById(@Param('id') id: string) {
    return this.marketingService.getDealById(id);
  }

    @Post('deals')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('bannerImages', 5))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Deal created successfully' })
  async createDeal(
    @Body() dealData: any,
    @CurrentUser() user: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.marketingService.createDeal(dealData, user.id, files);
  }

  @Put('deals/:id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('bannerImages', 5))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Deal updated successfully' })
  async updateDeal(
    @Param('id') id: string,
    @Body() updateData: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.marketingService.updateDeal(id, updateData, files);
  }

  @Put('deals/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Deal status updated' })
  async updateDealStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.marketingService.updateDealStatus(id, isActive);
  }

  @Put('deals/:id/feature')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Deal feature status updated' })
  async toggleDealFeatured(
    @Param('id') id: string,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.marketingService.toggleDealFeatured(id, isFeatured);
  }

  @Delete('deals/:id')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Deal deleted successfully' })
  async deleteDeal(@Param('id') id: string) {
    return this.marketingService.deleteDeal(id);
  }

  @Get('deals/:id/analytics')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Get deal analytics' })
  async getDealAnalytics(@Param('id') id: string) {
    return this.marketingService.getDealAnalytics(id);
  }

  @Post('deals/:id/apply')
  @ApiResponse({ status: 200, description: 'Apply deal to order' })
  async applyDealToOrder(
    @Param('id') id: string,
    @Body('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.marketingService.applyDealToOrder(id, orderId, user.id);
  }

  // COUPONS MANAGEMENT (REQ-081)
  @Get('coupons')
  @Roles(UserRole.ADMIN)
  @ApiResponse({ status: 200, description: 'Get all coupons with filters' })
  async getAllCoupons(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.marketingService.getAllCoupons({
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      search,
      type,
      status,
      isActive,
    });
  }

  // COUPONS MANAGEMENT (REQ-081)
  @Get('coupons')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get all coupons with filters' })
  async getAllCoupons(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.marketingService.getAllCoupons({
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      search,
      type,
      status,
      isActive,
    });
  }

  @Get('coupons/validate/:code')
  @ApiResponse({ status: 200, description: 'Validate coupon code' })
  async validateCoupon(
    @Param('code') code: string,
    @Query('customerId') customerId: string,
    @Query('orderValue') orderValue: number,
    @Query('products') products: string, // JSON string of product IDs
  ) {
    return this.marketingService.validateCoupon(
      code,
      customerId,
      orderValue,
      JSON.parse(products || '[]'),
    );
  }

  @Get('coupons/:id')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get coupon by ID' })
  async getCouponById(@Param('id') id: string) {
    return this.marketingService.getCouponById(id);
  }

  @Post('coupons')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  async createCoupon(@Body() couponData: any, @GetUser() user: any) {
    return this.marketingService.createCoupon(couponData, user.id);
  }

  @Post('coupons/generate-batch')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 201, description: 'Coupon batch generated successfully' })
  async generateCouponBatch(
    @Body() batchData: any,
    @GetUser() user: any,
  ) {
    return this.marketingService.generateCouponBatch(batchData, user.id);
  }

  @Put('coupons/:id')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
  async updateCoupon(@Param('id') id: string, @Body() updateData: any) {
    return this.marketingService.updateCoupon(id, updateData);
  }

  @Put('coupons/:id/status')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Coupon status updated' })
  async updateCouponStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.marketingService.updateCouponStatus(id, isActive);
  }

  @Delete('coupons/:id')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
  async deleteCoupon(@Param('id') id: string) {
    return this.marketingService.deleteCoupon(id);
  }

  @Post('coupons/:code/redeem')
  @ApiResponse({ status: 200, description: 'Coupon redeemed successfully' })
  async redeemCoupon(
    @Param('code') code: string,
    @Body('orderId') orderId: string,
    @Body('customerId') customerId: string,
    @Body('orderValue') orderValue: number,
  ) {
    return this.marketingService.redeemCoupon(code, orderId, customerId, orderValue);
  }

  @Get('coupons/:id/usage-history')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get coupon usage history' })
  async getCouponUsageHistory(@Param('id') id: string) {
    return this.marketingService.getCouponUsageHistory(id);
  }

  @Get('coupons/:id/analytics')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get coupon analytics' })
  async getCouponAnalytics(@Param('id') id: string) {
    return this.marketingService.getCouponAnalytics(id);
  }

  @Post('coupons/:id/distribute')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Distribute coupon to customers' })
  async distributeCoupon(
    @Param('id') id: string,
    @Body() distributionData: any,
  ) {
    return this.marketingService.distributeCoupon(id, distributionData);
  }

  // PROMOTIONS MANAGEMENT (REQ-082)
  @Get('promotions')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get all promotions with filters' })
  async getAllPromotions(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.marketingService.getAllPromotions({
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      search,
      type,
      status,
    });
  }

  @Get('promotions/active')
  @ApiResponse({ status: 200, description: 'Get active promotions' })
  async getActivePromotions(@Query('channel') channel?: string) {
    return this.marketingService.getActivePromotions(channel);
  }

  @Get('promotions/:id')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get promotion by ID' })
  async getPromotionById(@Param('id') id: string) {
    return this.marketingService.getPromotionById(id);
  }

  @Post('promotions')
  @Roles('admin', 'marketing_manager')
  @UseInterceptors(FilesInterceptor('media', 10))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Promotion created successfully' })
  async createPromotion(
    @Body() promotionData: any,
    @GetUser() user: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.marketingService.createPromotion(promotionData, user.id, files);
  }

  @Put('promotions/:id')
  @Roles('admin', 'marketing_manager')
  @UseInterceptors(FilesInterceptor('media', 10))
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Promotion updated successfully' })
  async updatePromotion(
    @Param('id') id: string,
    @Body() updateData: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.marketingService.updatePromotion(id, updateData, files);
  }

  @Put('promotions/:id/status')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Promotion status updated' })
  async updatePromotionStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.marketingService.updatePromotionStatus(id, status);
  }

  @Post('promotions/:id/launch')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Promotion launched successfully' })
  async launchPromotion(@Param('id') id: string) {
    return this.marketingService.launchPromotion(id);
  }

  @Post('promotions/:id/pause')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Promotion paused successfully' })
  async pausePromotion(@Param('id') id: string) {
    return this.marketingService.pausePromotion(id);
  }

  @Delete('promotions/:id')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully' })
  async deletePromotion(@Param('id') id: string) {
    return this.marketingService.deletePromotion(id);
  }

  @Get('promotions/:id/analytics')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get promotion analytics' })
  async getPromotionAnalytics(@Param('id') id: string) {
    return this.marketingService.getPromotionAnalytics(id);
  }

  @Post('promotions/:id/ab-test')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Setup A/B test for promotion' })
  async setupABTest(
    @Param('id') id: string,
    @Body() abTestData: any,
  ) {
    return this.marketingService.setupABTest(id, abTestData);
  }

  @Get('promotions/:id/performance')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get promotion performance metrics' })
  async getPromotionPerformance(@Param('id') id: string) {
    return this.marketingService.getPromotionPerformance(id);
  }

  // MARKETING ANALYTICS & INSIGHTS
  @Get('dashboard')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get marketing dashboard data' })
  async getMarketingDashboard(
    @Query('period') period = '30d',
  ) {
    return this.marketingService.getMarketingDashboard(period);
  }

  @Get('analytics/overview')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get marketing analytics overview' })
  async getMarketingAnalytics(
    @Query('period') period = '30d',
    @Query('type') type?: string,
  ) {
    return this.marketingService.getMarketingAnalytics(period, type);
  }

  @Get('analytics/roi')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get marketing ROI analysis' })
  async getMarketingROI(
    @Query('period') period = '30d',
  ) {
    return this.marketingService.getMarketingROI(period);
  }

  @Get('analytics/customer-segmentation')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get customer segmentation data' })
  async getCustomerSegmentation() {
    return this.marketingService.getCustomerSegmentation();
  }

  @Get('templates')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Get marketing templates' })
  async getMarketingTemplates(@Query('type') type?: string) {
    return this.marketingService.getMarketingTemplates(type);
  }

  @Post('campaigns/email/send')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Send email campaign' })
  async sendEmailCampaign(
    @Body() campaignData: any,
    @GetUser() user: any,
  ) {
    return this.marketingService.sendEmailCampaign(campaignData, user.id);
  }

  @Post('campaigns/sms/send')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Send SMS campaign' })
  async sendSMSCampaign(
    @Body() campaignData: any,
    @GetUser() user: any,
  ) {
    return this.marketingService.sendSMSCampaign(campaignData, user.id);
  }

  @Get('reports/export')
  @Roles('admin', 'marketing_manager')
  @ApiResponse({ status: 200, description: 'Export marketing reports' })
  async exportMarketingReports(
    @Query('type') type: string,
    @Query('period') period = '30d',
    @Query('format') format = 'csv',
  ) {
    return this.marketingService.exportMarketingReports(type, period, format);
  }
}