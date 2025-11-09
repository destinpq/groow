import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';
import { Deal } from './entities/deal.entity';
import { Coupon } from './entities/coupon.entity';
import { Promotion } from './entities/promotion.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { NotificationModule } from '@/modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Deal,
      Coupon,
      Promotion,
      User,
    ]),
    NotificationModule,
  ],
  controllers: [MarketingController],
  providers: [MarketingService],
  exports: [MarketingService],
})
export class MarketingModule {}