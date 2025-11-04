import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums';
import { ApiResponse } from '@/common/dto/api-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category (Admin only)' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return ApiResponse.success('Category created successfully', category);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll() {
    const categories = await this.categoryService.findAll();
    return ApiResponse.success('Categories retrieved successfully', categories);
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get categories with hierarchy' })
  async findAllWithHierarchy() {
    const categories = await this.categoryService.findAllWithHierarchy();
    return ApiResponse.success('Category hierarchy retrieved', categories);
  }

  @Get(':id/subcategories')
  @ApiOperation({ summary: 'Get subcategories' })
  async getSubcategories(@Param('id') id: string) {
    const subcategories = await this.categoryService.getSubcategories(id);
    return ApiResponse.success('Subcategories retrieved', subcategories);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.findBySlug(slug);
    return ApiResponse.success('Category retrieved successfully', category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return ApiResponse.success('Category retrieved successfully', category);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (Admin only)' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.update(id, updateCategoryDto);
    return ApiResponse.success('Category updated successfully', category);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return ApiResponse.success('Category deleted successfully');
  }
}
