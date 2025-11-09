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
  // FORCE REBUILD - Nov 9, 2025 - Fix CORS duplicate headers
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          'https://groow.destinpq.com',
          'https://groow-frontend.vercel.app', 
          'https://groow-frontend-iftdz6ipx-pratik-destinpqs-projects.vercel.app',
          'https://groow-git-main-pratik-destinpqs-projects.vercel.app',
          'https://groow-frontend-cqrljz5r9-pratik-destinpqs-projects.vercel.app',
          'http://localhost:3000',
          'http://localhost:3001'
        ];

        // Allow if no origin (mobile apps) or if origin is in allowed list
        if (!origin || allowedOrigins.includes(origin) || 
            origin.includes('vercel.app') || 
            origin.includes('destinpq.com')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      credentials: true,
      maxAge: 3600
    }
  });
  
  const configService = app.get(ConfigService);

  // Security middleware
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
