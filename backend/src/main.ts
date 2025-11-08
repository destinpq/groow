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
  // FORCE REBUILD - Nov 8, 2025 - Fix database connection with individual params
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security - helmet and compression only
  app.use(helmet());
  app.use(compression());

  // Security - AFTER CORS
  app.use(helmet());
  app.use(compression());

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
