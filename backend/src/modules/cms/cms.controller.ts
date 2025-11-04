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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { CreateBannerDto, CreateFaqDto, CreatePageDto } from './dto/cms.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('CMS')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // Banner Endpoints
  @Post('banners')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create banner (Admin only)' })
  createBanner(@Body() createBannerDto: CreateBannerDto) {
    return this.cmsService.createBanner(createBannerDto);
  }

  @Get('banners')
  @ApiOperation({ summary: 'Get all banners' })
  getAllBanners() {
    return this.cmsService.getAllBanners();
  }

  @Get('banners/active')
  @ApiOperation({ summary: 'Get active banners' })
  getActiveBanners(@Query('placement') placement?: string) {
    return this.cmsService.getActiveBanners(placement);
  }

  @Put('banners/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update banner (Admin only)' })
  updateBanner(@Param('id') id: string, @Body() updateData: Partial<CreateBannerDto>) {
    return this.cmsService.updateBanner(id, updateData);
  }

  @Delete('banners/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete banner (Admin only)' })
  deleteBanner(@Param('id') id: string) {
    return this.cmsService.deleteBanner(id);
  }

  // FAQ Endpoints
  @Post('faqs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create FAQ (Admin only)' })
  createFaq(@Body() createFaqDto: CreateFaqDto) {
    return this.cmsService.createFaq(createFaqDto);
  }

  @Get('faqs')
  @ApiOperation({ summary: 'Get all FAQs' })
  getAllFaqs() {
    return this.cmsService.getAllFaqs();
  }

  @Get('faqs/active')
  @ApiOperation({ summary: 'Get active FAQs' })
  getActiveFaqs(@Query('category') category?: string) {
    return this.cmsService.getActiveFaqs(category);
  }

  @Put('faqs/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update FAQ (Admin only)' })
  updateFaq(@Param('id') id: string, @Body() updateData: Partial<CreateFaqDto>) {
    return this.cmsService.updateFaq(id, updateData);
  }

  @Delete('faqs/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete FAQ (Admin only)' })
  deleteFaq(@Param('id') id: string) {
    return this.cmsService.deleteFaq(id);
  }

  // Page Endpoints
  @Post('pages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create page (Admin only)' })
  createPage(@Body() createPageDto: CreatePageDto) {
    return this.cmsService.createPage(createPageDto);
  }

  @Get('pages')
  @ApiOperation({ summary: 'Get all pages' })
  getAllPages() {
    return this.cmsService.getAllPages();
  }

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  getPageBySlug(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }

  @Put('pages/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update page (Admin only)' })
  updatePage(@Param('id') id: string, @Body() updateData: Partial<CreatePageDto>) {
    return this.cmsService.updatePage(id, updateData);
  }

  @Delete('pages/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete page (Admin only)' })
  deletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }
}
