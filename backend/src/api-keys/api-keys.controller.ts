import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api-keys')
@UseGuards(AuthGuard('jwt')) // Assurez-vous que seuls les utilisateurs authentifiés peuvent accéder
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async createApiKey(
    @Body() createApiKeyDto: { serviceName: string; description?: string },
  ) {
    const apiKey = await this.apiKeysService.createApiKey(
      createApiKeyDto.serviceName,
      createApiKeyDto.description,
    );
    return {
      id: apiKey.id,
      key: apiKey.key, // Ne sera affiché qu'une seule fois à la création
      serviceName: apiKey.serviceName,
    };
  }

  @Get()
  async getAllApiKeys() {
    const apiKeys = await this.apiKeysService.getAllApiKeys();
    // Ne pas renvoyer les clés API elles-mêmes dans la liste
    return apiKeys.map(({ key, ...rest }) => rest);
  }

  @Delete(':id')
  async deactivateApiKey(@Param('id') id: string) {
    await this.apiKeysService.deactivateApiKey(id);
    return { success: true };
  }
}
