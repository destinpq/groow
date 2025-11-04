import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Faq } from './entities/faq.entity';
import { Page } from './entities/page.entity';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Banner, Faq, Page])],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
