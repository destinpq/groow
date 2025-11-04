import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/category.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { ApiResponse } from '@/common/dto/api-response.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create brand (Admin only)' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandService.create(createBrandDto);
    return ApiResponse.success('Brand created successfully', brand);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  async findAll() {
    const brands = await this.brandService.findAll();
    return ApiResponse.success('Brands retrieved successfully', brands);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get brand by slug' })
  async findBySlug(@Param('slug') slug: string) {
    const brand = await this.brandService.findBySlug(slug);
    return ApiResponse.success('Brand retrieved successfully', brand);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID' })
  async findOne(@Param('id') id: string) {
    const brand = await this.brandService.findOne(id);
    return ApiResponse.success('Brand retrieved successfully', brand);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update brand (Admin only)' })
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandService.update(id, updateBrandDto);
    return ApiResponse.success('Brand updated successfully', brand);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete brand (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.brandService.remove(id);
    return ApiResponse.success('Brand deleted successfully');
  }
}
