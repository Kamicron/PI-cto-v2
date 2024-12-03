import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../photos/entities/photo.entity';
import { Folder } from '../folder/entities/folder.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async uploadImage(folderId: string, file: Express.Multer.File) {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (!folder) {
      throw new Error(`Folder with ID ${folderId} does not exist.`);
    }

    const photo = this.photoRepository.create({
      name: file.originalname,
      url: `${folderId}/${file.filename}`,
      folder,
    });

    return this.photoRepository.save(photo);
  }
}
