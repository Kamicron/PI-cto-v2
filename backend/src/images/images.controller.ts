import {
  Controller,
  Param,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':folderId/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folderId = req.params.folderId;
          const folderPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            folderId,
          );

          // Vérifie si le dossier existe, sinon le crée
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
          }

          cb(null, folderPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadImage(
    @Param('folderId') folderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.uploadImage(folderId, file);
  }

  @Get(':photoId')
  async getPhoto(@Param('photoId') photoId: string) {
    return this.imagesService.getPhoto(photoId);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    return this.imagesService.deleteImage(id);
  }
}
