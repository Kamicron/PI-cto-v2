import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey || !(await this.apiKeysService.validateApiKey(apiKey))) {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
