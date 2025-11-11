import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MarketingService } from '@/modules/marketing/marketing.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { GetPromotionsDto } from './dto/marketing-query.dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('promotions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromotionsController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all promotions' })
  @ApiResponse({ status: 200, description: 'Promotions retrieved successfully' })
  async getAllPromotions(@Query() filters: GetPromotionsDto) {
    return this.marketingService.getAllPromotions(filters);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get promotions statistics' })
  @ApiResponse({ status: 200, description: 'Promotions stats retrieved successfully' })
  async getPromotionsStats() {
    return this.marketingService.getPromotionsStats();
  }
}