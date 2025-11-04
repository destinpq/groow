import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, VerifyPaymentDto, PaymentFilterDto } from './dto/payment.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UserRole } from '@/common/enums';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Initiate payment for order' })
  initiatePayment(
    @CurrentUser('id') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.initiatePayment(userId, createPaymentDto);
  }

  @Post(':id/verify')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Verify payment after gateway callback' })
  verifyPayment(
    @Param('id') paymentId: string,
    @Body() verifyPaymentDto: VerifyPaymentDto,
  ) {
    return this.paymentService.verifyPayment(paymentId, verifyPaymentDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  getPaymentHistory(@Query() filters: PaymentFilterDto) {
    return this.paymentService.getPaymentHistory(filters);
  }

  @Get('my-payments')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get user payment history' })
  getMyPayments(
    @CurrentUser('id') userId: string,
    @Query() filters: PaymentFilterDto,
  ) {
    return this.paymentService.getPaymentHistory({ ...filters, userId });
  }

  // Wallet endpoints
  @Get('wallet/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  getWalletBalance(
    @CurrentUser('role') role: string,
    @CurrentUser('id') userId: string,
  ) {
    if (role === UserRole.VENDOR) {
      return this.paymentService.getWalletBalance(userId, null);
    } else if (role === UserRole.CUSTOMER) {
      return this.paymentService.getWalletBalance(null, userId);
    }
  }

  @Get('wallet/transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  getWalletTransactions(
    @CurrentUser('role') role: string,
    @CurrentUser('id') userId: string,
  ) {
    if (role === UserRole.VENDOR) {
      return this.paymentService.getWalletTransactions(userId, null);
    } else if (role === UserRole.CUSTOMER) {
      return this.paymentService.getWalletTransactions(null, userId);
    }
  }

  @Post('wallet/credit')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Add credit to wallet (Admin only)' })
  addCredit(
    @Body('userId') userId: string,
    @Body('role') role: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
  ) {
    if (role === UserRole.VENDOR) {
      return this.paymentService.addToWallet(userId, null, amount, description);
    } else if (role === UserRole.CUSTOMER) {
      return this.paymentService.addToWallet(null, userId, amount, description);
    }
  }
}
