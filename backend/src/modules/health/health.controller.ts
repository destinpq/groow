import { Controller, Get, Post, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint for monitoring' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        environment: { type: 'string', example: 'production' },
        version: { type: 'string', example: '1.0.0' },
        database: { type: 'object' },
        config: { type: 'object' }
      }
    }
  })
  async check() {
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: await this.checkDatabase(),
      config: this.getConfigSummary(),
    };

    // If database is not healthy, set overall status to error
    if (healthStatus.database.status !== 'connected') {
      healthStatus.status = 'error';
      throw new HttpException(healthStatus, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return healthStatus;
  }

  @Get('database')
  @ApiOperation({ summary: 'Database connection health check' })
  async checkDatabase() {
    try {
      if (!this.dataSource.isInitialized) {
        return {
          status: 'not_initialized',
          message: 'Database connection not initialized',
          timestamp: new Date().toISOString(),
        };
      }

      // Test database connection with a simple query
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'connected',
        message: 'Database connection is healthy',
        isInitialized: this.dataSource.isInitialized,
        driver: this.dataSource.options.type,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        error: error.name,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private getConfigSummary() {
    return {
      nodeEnv: this.configService.get('NODE_ENV'),
      port: this.configService.get('PORT'),
      host: this.configService.get('HOST'),
      databaseUrl: this.configService.get('DATABASE_URL') ? 'configured' : 'not_configured',
      redisUrl: this.configService.get('REDIS_URL') ? 'configured' : 'not_configured',
      ssl: this.configService.get('DATABASE_SSL'),
      sync: this.configService.get('DATABASE_SYNC'),
      logging: this.configService.get('DATABASE_LOGGING'),
    };
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed basic admin user' })
  seed() {
    return {
      status: 'ok',
      message: 'Database would be seeded here',
      admin: {
        email: 'admin@groow.com',
        password: 'admin123',
        note: 'This is a placeholder - full database functionality will be restored when DB is properly connected'
      }
    };
  }
}