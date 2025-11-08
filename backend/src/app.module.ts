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
        
        console.log('🔧 Database Configuration:');
        console.log('  NODE_ENV:', nodeEnv);
        console.log('  DATABASE_URL present:', !!databaseUrl);
        console.log('  Is Production:', isProduction);
        
        // Railway PostgreSQL configuration
        if (databaseUrl && isProduction) {
          const urlWithSsl = databaseUrl + (databaseUrl.includes('?') ? '&' : '?') + 'sslmode=require';
          console.log('  Using Railway PostgreSQL with SSL');
          return {
            type: 'postgres',
            url: urlWithSsl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Always false in production
            logging: false,     // Disable logging in production
            ssl: {
              rejectUnauthorized: false
            },
            extra: {
              ssl: {
                rejectUnauthorized: false
              }
            }
          };
        }
        
        // Local development configuration  
        console.log('  Using local development database');
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
        console.log('🔧 Redis Configuration:');
        console.log('  REDIS_URL present:', !!redisUrl);
        
        if (redisUrl) {
          console.log('  Using Redis URL connection');
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
        
        console.log('  Using Redis host/port connection');
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
