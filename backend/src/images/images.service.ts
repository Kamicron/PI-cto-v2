import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../photos/entities/photo.entity';
import { Folder } from '../folder/entities/folder.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

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

  async getPhoto(photoId: string): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId },
      relations: ['folder'], // Inclut le dossier associé
    });

    if (!photo) {
      throw new Error(`Photo with ID ${photoId} not found`);
    }

    return photo;
  }

  async deleteImage(id: string): Promise<{ success: boolean }> {
    const photo = await this.photoRepository.findOne({ where: { id } });

    if (!photo) {
      throw new Error('Photo introuvable.');
    }

    // Supprimer le fichier physique
    const filePath = join(__dirname, '../../uploads', photo.url);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du fichier :',
        error.message,
      );
      throw new Error('Erreur lors de la suppression du fichier physique.');
    }

    // Supprimer l'entrée de la base de données
    await this.photoRepository.delete(id);

    return { success: true };
  }
}
