import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    
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

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      console.log(`CORS Middleware: Handling OPTIONS request for ${req.url} from origin: ${origin}`);
      res.status(204).end();
      return;
    }

    next();
  }
}