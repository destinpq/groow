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
  // FORCE REBUILD - Nov 8, 2025 - Bootstrap controller deployment
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get the underlying Express instance
  const expressApp = app.getHttpAdapter().getInstance();
  
  // Apply raw CORS before anything else
  expressApp.use((req, res, next) => {
    const origin = req.headers.origin;
    
    console.log(`Direct Express CORS: ${req.method} ${req.url} from origin: ${origin}`);
    
    // Allowed origins
    const allowedOrigins = [
      'https://groow.destinpq.com',
      'https://groow-frontend.vercel.app', 
      'https://groow-frontend-iftdz6ipx-pratik-destinpqs-projects.vercel.app',
      'https://grooow-api-db.destinpq.com',
      'https://groow-git-main-pratik-destinpqs-projects.vercel.app',
      'https://groow-frontend-cqrljz5r9-pratik-destinpqs-projects.vercel.app',
    ];

    const isAllowed = origin && (
      allowedOrigins.includes(origin) || 
      origin.includes('vercel.app') ||
      origin.includes('destinpq.com')
    );

    if (isAllowed || !origin) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '3600');
    }

    // Handle preflight OPTIONS requests immediately
    if (req.method === 'OPTIONS') {
      console.log(`Direct Express CORS: Handling OPTIONS for ${req.url}`);
      res.status(204).end();
      return;
    }

    next();
  });

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
