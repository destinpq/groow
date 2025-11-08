import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import * as session from 'express-session';
import * as RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { AppModule } from './app.module';

async function bootstrap() {
  // Clean Railway deployment with database connection - Nov 8, 2025
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS - Allow multiple origins
  const defaultOrigins = [
    'https://groow.destinpq.com',
    'https://groow-frontend.vercel.app',
    'https://groow-frontend-iftdz6ipx-pratik-destinpqs-projects.vercel.app',
  ];

  // Add development origins only in non-production environments
  const nodeEnv = configService.get('NODE_ENV', 'development');
  if (nodeEnv !== 'production') {
    defaultOrigins.push(
      'http://localhost:8001',
      'http://localhost:3000',
      'http://127.0.0.1:8001',
      'http://127.0.0.1:3000',
    );
  }

  const allowedOrigins = [...defaultOrigins];

  // Add CORS_ORIGINS from environment if available
  const envOrigins = configService.get('CORS_ORIGINS');
  if (envOrigins) {
    allowedOrigins.push(...envOrigins.split(',').map(origin => origin.trim()));
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });

  // Global prefix
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Redis session (optional - comment out if Redis is not running)
  // const redisClient = createClient({
  //   url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
  // });
  // await redisClient.connect();

  // app.use(
  //   session({
  //     store: new (RedisStore as any)({ client: redisClient }),
  //     secret: configService.get('SESSION_SECRET'),
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: parseInt(configService.get('SESSION_MAX_AGE')),
  //       httpOnly: true,
  //       secure: configService.get('NODE_ENV') === 'production',
  //     },
  //   }),
  // });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Groow E-Commerce API')
    .setDescription('Comprehensive E-Commerce Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Admin')
    .addTag('Vendor')
    .addTag('Customer')
    .addTag('Products')
    .addTag('Orders')
    .addTag('RFQ')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(configService.get('PORT', '3001'));
  const host = configService.get('HOST', '0.0.0.0'); // Railway requires 0.0.0.0 binding
  
  await app.listen(port, host);
  console.log(`🚀 Application running on: http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
}

bootstrap();
