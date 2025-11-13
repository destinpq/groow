import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto, CreateServiceReviewDto, FilterServicesDto } from './dto/service.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  create(@Body() createServiceDto: CreateServiceDto, @Request() req) {
    return this.serviceService.create(createServiceDto, req.user.id);
  }

  @Get()
  findAll(@Query() filters: FilterServicesDto) {
    return this.serviceService.findAll(filters);
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.serviceService.getFeaturedServices(limit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(@Request() req, @Query('vendorId') vendorId?: string) {
    // If user is vendor, only show their stats
    if (req.user.role === UserRole.VENDOR) {
      return this.serviceService.getServiceStats(req.user.id);
    }
    // Admin can view all stats or specific vendor stats
    return this.serviceService.getServiceStats(vendorId);
  }

  @Get('vendor/:vendorId')
  getServicesByVendor(@Param('vendorId', ParseUUIDPipe) vendorId: string) {
    return this.serviceService.getServicesByVendor(vendorId);
  }

  @Get('my-services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  getMyServices(@Request() req) {
    return this.serviceService.getServicesByVendor(req.user.id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.serviceService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req
  ) {
    const vendorId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.serviceService.update(id, updateServiceDto, vendorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const vendorId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.serviceService.remove(id, vendorId);
  }

  // Review endpoints
  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  createReview(
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body() createReviewDto: CreateServiceReviewDto,
    @Request() req
  ) {
    return this.serviceService.createReview(
      { ...createReviewDto, serviceId },
      req.user.id
    );
  }

  @Get(':id/reviews')
  getServiceReviews(@Param('id', ParseUUIDPipe) serviceId: string) {
    return this.serviceService.getServiceReviews(serviceId);
  }
}