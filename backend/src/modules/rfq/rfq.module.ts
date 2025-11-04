import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rfq } from './entities/rfq.entity';
import { Quotation } from './entities/quotation.entity';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { NotificationModule } from '@/modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rfq, Quotation]),
    NotificationModule,
  ],
  controllers: [RfqController],
  providers: [RfqService],
  exports: [RfqService],
})
export class RfqModule {}
