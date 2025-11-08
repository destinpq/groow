import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UploadModule } from './modules/upload/upload.module';
import { CmsModule } from './modules/cms/cms.module';
import { ReportModule } from './modules/report/report.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Railway provides DATABASE_URL, parse it if available
        const databaseUrl = config.get('DATABASE_URL');
        
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: config.get('DATABASE_SYNC', false),
            logging: config.get('DATABASE_LOGGING', false),
            ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          };
        }
        
        // Fallback to individual config values
        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: config.get('DATABASE_SYNC', false),
          logging: config.get('DATABASE_LOGGING', false),
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Railway provides REDIS_URL, parse it if available
        const redisUrl = config.get('REDIS_URL');
        
        if (redisUrl) {
          return {
            redis: {
              url: redisUrl,
            },
          };
        }
        
        // Fallback to individual config values
        return {
          redis: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
            password: config.get('REDIS_PASSWORD'),
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    
    // Feature modules
    AuthModule,
    AdminModule,
    VendorModule,
    CustomerModule,
    ProductModule,
    OrderModule,
    RfqModule,
    NotificationModule,
    PaymentModule,
    UploadModule,
    CmsModule,
    ReportModule,
    HealthModule,
  ],
})
export class AppModule {}
