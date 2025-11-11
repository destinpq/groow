import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Transaction } from './entities/transaction.entity';
import { VendorPayout } from './entities/vendor-payout.entity';
import { Refund } from './entities/refund.entity';
import { Order } from '@/modules/order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, VendorPayout, Refund, Order])
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}