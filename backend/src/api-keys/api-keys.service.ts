import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeysRepository: Repository<ApiKey>,
  ) {}

  private generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }

  async createApiKey(serviceName: string, description?: string): Promise<ApiKey> {
    const apiKey = this.apiKeysRepository.create({
      key: this.generateApiKey(),
      serviceName,
      description,
      isActive: true,
    });

    return this.apiKeysRepository.save(apiKey);
  }

  async validateApiKey(key: string): Promise<boolean> {
    const apiKey = await this.findByKey(key);
    if (!apiKey) {
      return false;
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      apiKey.isActive = false;
      await this.apiKeysRepository.save(apiKey);
      return false;
    }

    return apiKey.isActive;
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    return this.apiKeysRepository.findOne({
      where: { key },
    });
  }

  async deactivateApiKey(id: string): Promise<void> {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { id },
    });

    if (!apiKey) {
      throw new UnauthorizedException('API key not found');
    }

    apiKey.isActive = false;
    await this.apiKeysRepository.save(apiKey);
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    return this.apiKeysRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
