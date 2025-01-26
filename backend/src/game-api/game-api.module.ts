import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GameApiController } from './game-api.controller';
import { GameApiService } from './game-api.service';
import { ApiKeyMiddleware } from '../middleware/api-key.middleware';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { FolderModule } from '../folder/folder.module';
import { PhotosModule } from '../photos/photos.module';

@Module({
  imports: [ApiKeysModule, FolderModule, PhotosModule],
  controllers: [GameApiController],
  providers: [GameApiService],
})
export class GameApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('game-api');
  }
}
