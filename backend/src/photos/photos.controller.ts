import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';
import { Express } from 'express';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const { folderId } = req.body;
          const uploadPath = join(__dirname, '..', '..', 'uploads', folderId);
          
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  create(@UploadedFile() file: Express.Multer.File, @Body() createPhotoDto: CreatePhotoDto) {
    if (file) {
      createPhotoDto.file = file;
    }
    return this.photosService.create(createPhotoDto);
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.photosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.photosService.remove(id);
  }
}
