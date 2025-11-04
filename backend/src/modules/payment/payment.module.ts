import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { Vendor } from '@/modules/auth/entities/vendor.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      WalletTransaction,
      Order,
      Vendor,
      Customer,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
