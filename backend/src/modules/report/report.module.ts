import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Order } from '@/modules/order/entities/order.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { Product } from '@/modules/product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product])
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
