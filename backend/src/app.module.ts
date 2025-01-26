import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FolderModule } from './folder/folder.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';
import { PhotosModule } from './photos/photos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { GameApiModule } from './game-api/game-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    FolderModule,
    AuthModule,
    ImagesModule,
    PhotosModule,
    ApiKeysModule,
    GameApiModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
