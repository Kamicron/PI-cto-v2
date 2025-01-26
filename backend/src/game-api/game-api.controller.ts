import {
  Controller,
  Param,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Res,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GameApiService } from './game-api.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

@Controller('game-api/profile')
export class GameApiController {
  constructor(private readonly gameApiService: GameApiService) {}

  @Post(':uuid')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // On sauvegarde temporairement dans uploads
          const uploadPath = join(__dirname, '..', '..', 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // On garde le nom "profile.png" pour la photo de profil
          cb(null, 'profile.png');
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePicture(
    @Headers('x-api-key') apiKey: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // On obtient le dossier du joueur
    const playerFolder = await this.gameApiService.ensureGameFolderStructure(apiKey, uuid);
    
    // On crée le dossier final si nécessaire
    const finalPath = join(__dirname, '..', '..', 'uploads', playerFolder.id);
    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    // On déplace le fichier vers le bon dossier
    const tempPath = file.path;
    const finalFilePath = join(finalPath, 'profile.png');
    fs.renameSync(tempPath, finalFilePath);

    // On met à jour le chemin du fichier pour le service
    file.path = finalFilePath;
    
    return this.gameApiService.uploadProfilePicture(apiKey, uuid, file);
  }

  @Get(':uuid')
  async getProfilePicture(
    @Headers('x-api-key') apiKey: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Res() res: Response,
  ) {
    const photo = await this.gameApiService.getProfilePicture(apiKey, uuid);
    res.redirect(`/uploads/${photo.url}`);
  }

  @Delete(':uuid')
  async deleteProfilePicture(
    @Headers('x-api-key') apiKey: string,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    await this.gameApiService.deleteProfilePicture(apiKey, uuid);
    return { success: true };
  }
}
