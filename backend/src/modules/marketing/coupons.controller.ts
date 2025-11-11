import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MarketingService } from '@/modules/marketing/marketing.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { GetCouponsDto } from './dto/marketing-query.dto';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponsController {
  constructor(private readonly marketingService: MarketingService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({ status: 200, description: 'Coupons retrieved successfully' })
  async getAllCoupons(@Query() filters: GetCouponsDto) {
    return this.marketingService.getAllCoupons(filters);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get coupons statistics' })
  @ApiResponse({ status: 200, description: 'Coupons stats retrieved successfully' })
  async getCouponsStats() {
    return this.marketingService.getCouponsStats();
  }
}