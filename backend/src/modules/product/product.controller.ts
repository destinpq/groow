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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/product.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole, ProductStatus } from '@/common/enums';
import { ApiResponse } from '@/common/dto/api-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return ApiResponse.success('Product created successfully', product);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  async findAll(@Query() filters: ProductFilterDto) {
    const result = await this.productService.findAll(filters);
    return ApiResponse.success('Products retrieved successfully', result);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  async getFeatured(@Query('limit') limit?: number) {
    const products = await this.productService.getFeaturedProducts(limit);
    return ApiResponse.success('Featured products retrieved', products);
  }

  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended products' })
  async getRecommended(@Query('limit') limit?: number) {
    const products = await this.productService.getRecommendedProducts(limit);
    return ApiResponse.success('Recommended products retrieved', products);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get products by vendor' })
  async getVendorProducts(
    @Param('vendorId') vendorId: string,
    @Query() filters: ProductFilterDto,
  ) {
    const result = await this.productService.getVendorProducts(vendorId, filters);
    return ApiResponse.success('Vendor products retrieved', result);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async findBySlug(@Param('slug') slug: string) {
    const product = await this.productService.findBySlug(slug);
    return ApiResponse.success('Product retrieved successfully', product);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return ApiResponse.success('Product retrieved successfully', product);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    return ApiResponse.success('Product updated successfully', product);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ) {
    const product = await this.productService.updateStatus(id, status);
    return ApiResponse.success('Product status updated', product);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock' })
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    const product = await this.productService.updateStock(id, quantity);
    return ApiResponse.success('Stock updated successfully', product);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return ApiResponse.success('Product deleted successfully');
  }
}
