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
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.railway', '.env.production', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get('DATABASE_URL');
        const nodeEnv = config.get('NODE_ENV', 'development');
        const isProduction = nodeEnv === 'production';
        
        // Railway PostgreSQL configuration
        if (databaseUrl && isProduction) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Always false in production
            logging: false,     // Disable logging in production
            ssl: {
              rejectUnauthorized: false,
              sslmode: 'require'
            },
            extra: {
              ssl: {
                rejectUnauthorized: false
              }
            }
          };
        }
        
        // Local development configuration  
        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST', 'localhost'),
          port: parseInt(config.get('DATABASE_PORT', '5432')),
          username: config.get('DATABASE_USER', 'postgres'),
          password: config.get('DATABASE_PASSWORD', 'password'),
          database: config.get('DATABASE_NAME', 'groow'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,  // Enable for development
          logging: true,      // Enable for development
          ssl: false
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL');
        
        if (redisUrl) {
          return {
            redis: {
              url: redisUrl,
              connectTimeout: parseInt(config.get('REDIS_CONNECT_TIMEOUT', '10000')),
              lazyConnect: true,
              retryDelayOnFailover: parseInt(config.get('REDIS_RETRY_DELAY', '100')),
              maxRetriesPerRequest: parseInt(config.get('REDIS_MAX_RETRIES', '3')),
            },
          };
        }
        
        return {
          redis: {
            host: config.get('REDIS_HOST', 'localhost'),
            port: parseInt(config.get('REDIS_PORT', '6379')),
            password: config.get('REDIS_PASSWORD'),
            connectTimeout: parseInt(config.get('REDIS_CONNECT_TIMEOUT', '10000')),
            lazyConnect: true,
            retryDelayOnFailover: parseInt(config.get('REDIS_RETRY_DELAY', '100')),
            maxRetriesPerRequest: parseInt(config.get('REDIS_MAX_RETRIES', '3')),
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    
    // All feature modules
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
    SeedModule,
  ],
})
export class AppModule {}
