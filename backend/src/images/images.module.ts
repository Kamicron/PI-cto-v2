import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { Photo } from '../photos/entities/photo.entity';
import { Folder } from '../folder/entities/folder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo, Folder]), // Enregistre Photo et Folder
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
