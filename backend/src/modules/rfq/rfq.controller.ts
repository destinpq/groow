import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RfqService } from './rfq.service';
import { CreateRfqDto, CreateQuotationDto, RfqFilterDto } from './dto/rfq.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole, RfqStatus } from '@/common/enums';

@ApiTags('RFQ')
@ApiBearerAuth()
@Controller('rfq')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @Post()
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create RFQ' })
  create(
    @CurrentUser('id') customerId: string,
    @Body() createRfqDto: CreateRfqDto,
  ) {
    return this.rfqService.create(customerId, createRfqDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get all RFQs' })
  findAll(@Query() filters: RfqFilterDto) {
    return this.rfqService.findAll(filters);
  }

  @Get('my-rfqs')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get customer RFQs' })
  getMyRfqs(
    @CurrentUser('id') customerId: string,
    @Query() filters: RfqFilterDto,
  ) {
    return this.rfqService.getCustomerRfqs(customerId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RFQ by ID' })
  findOne(@Param('id') id: string) {
    return this.rfqService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Update RFQ status' })
  updateStatus(@Param('id') id: string, @Body('status') status: RfqStatus) {
    return this.rfqService.updateStatus(id, status);
  }

  @Get(':id/quotations')
  @ApiOperation({ summary: 'Get quotations for RFQ' })
  getQuotations(@Param('id') rfqId: string) {
    return this.rfqService.getQuotations(rfqId);
  }

  // Quotation endpoints
  @Post('quotations')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Submit quotation' })
  createQuotation(
    @CurrentUser('id') vendorId: string,
    @Body() createQuotationDto: CreateQuotationDto,
  ) {
    return this.rfqService.createQuotation(vendorId, createQuotationDto);
  }

  @Get('quotations/my-quotations')
  @Roles(UserRole.VENDOR)
  @ApiOperation({ summary: 'Get vendor quotations' })
  getMyQuotations(@CurrentUser('id') vendorId: string) {
    return this.rfqService.getVendorQuotations(vendorId);
  }

  @Patch('quotations/:id/accept')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Accept quotation' })
  acceptQuotation(
    @Param('id') quotationId: string,
    @CurrentUser('id') customerId: string,
  ) {
    return this.rfqService.acceptQuotation(quotationId, customerId);
  }
}
