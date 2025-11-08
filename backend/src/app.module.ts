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
        
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: config.get('DATABASE_SYNC', 'false') === 'true',
            logging: config.get('DATABASE_LOGGING', 'false') === 'true',
            ssl: isProduction ? { rejectUnauthorized: false } : false,
            extra: {
              max: parseInt(config.get('DATABASE_MAX_CONNECTIONS', '20')),
              idleTimeoutMillis: parseInt(config.get('DATABASE_IDLE_TIMEOUT', '30000')),
              connectionTimeoutMillis: parseInt(config.get('DATABASE_CONNECTION_TIMEOUT', '10000')),
              acquireTimeoutMillis: parseInt(config.get('DATABASE_ACQUIRE_TIMEOUT', '60000')),
              createTimeoutMillis: parseInt(config.get('DATABASE_CREATE_TIMEOUT', '30000')),
              destroyTimeoutMillis: parseInt(config.get('DATABASE_DESTROY_TIMEOUT', '5000')),
              reapIntervalMillis: parseInt(config.get('DATABASE_REAP_INTERVAL', '1000')),
              createRetryIntervalMillis: parseInt(config.get('DATABASE_CREATE_RETRY_INTERVAL', '200')),
            }
          };
        }
        
        // Fallback configuration for local development
        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST', 'localhost'),
          port: parseInt(config.get('DATABASE_PORT', '5432')),
          username: config.get('DATABASE_USER', 'postgres'),
          password: config.get('DATABASE_PASSWORD', 'password'),
          database: config.get('DATABASE_NAME', 'groow'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: config.get('DATABASE_SYNC', 'false') === 'true',
          logging: config.get('DATABASE_LOGGING', !isProduction ? 'true' : 'false') === 'true',
          ssl: false,
          extra: {
            max: parseInt(config.get('DATABASE_MAX_CONNECTIONS', '10')),
            idleTimeoutMillis: parseInt(config.get('DATABASE_IDLE_TIMEOUT', '30000')),
            connectionTimeoutMillis: parseInt(config.get('DATABASE_CONNECTION_TIMEOUT', '10000')),
          }
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
