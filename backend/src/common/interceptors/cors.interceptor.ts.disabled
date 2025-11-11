import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    // Add CORS headers to all responses
    const origin = request.headers.origin || '*';
    
    // Check if origin is allowed
    const allowedOrigins = [
      'https://groow.destinpq.com',
      'https://groow-frontend.vercel.app',
      'https://groow-frontend-iftdz6ipx-pratik-destinpqs-projects.vercel.app',
      'https://grooow-api-db.destinpq.com',
      'https://groow-git-main-pratik-destinpqs-projects.vercel.app',
      'https://groow-frontend-cqrljz5r9-pratik-destinpqs-projects.vercel.app',
    ];

    const isAllowed = allowedOrigins.includes(origin) || 
                     origin.includes('vercel.app') ||
                     origin.includes('destinpq.com');

    if (isAllowed || !origin) {
      response.header('Access-Control-Allow-Origin', origin);
      response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
      response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
      response.header('Access-Control-Allow-Credentials', 'true');
      response.header('Access-Control-Max-Age', '3600');
    }

    // Handle OPTIONS requests immediately
    if (request.method === 'OPTIONS') {
      response.status(204).send();
      return;
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}