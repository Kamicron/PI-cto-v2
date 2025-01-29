import {
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { ImagesService } from './images.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('images')
@UseGuards(AuthGuard('jwt'))
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':folderId/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
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
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.imagesService.uploadImages(folderId, files);
  }

  @Get(':photoId')
  async getPhoto(@Param('photoId') photoId: string) {
    return this.imagesService.getPhoto(photoId);
  }

  @Patch(':id/rename')
  async renameImage(@Param('id') id: string, @Body('newName') newName: string) {
    if (!newName) {
      throw new Error('Le nouveau nom est requis.');
    }

    return this.imagesService.renameImage(id, newName);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    try {
      return await this.imagesService.deleteImage(id);
    } catch (error) {
      throw new Error(
        error.message ||
          "Une erreur est survenue lors de la suppression de l'image.",
      );
    }
  }
}
