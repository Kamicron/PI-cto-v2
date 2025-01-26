import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { FolderService } from '../folder/folder.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Express } from 'express';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private folderService: FolderService,
  ) {}

  async create(createPhotoDto: { name: string; file: Express.Multer.File; folderId: string }) {
    const folder = await this.folderService.findOne(createPhotoDto.folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }

    const photo = this.photoRepository.create({
      name: createPhotoDto.name,
      url: `${folder.id}/${createPhotoDto.file.filename}`,
      folder,
    });

    return this.photoRepository.save(photo);
  }

  async findAll() {
    return this.photoRepository.find();
  }

  async findOne(id: string) {
    return this.photoRepository.findOne({
      where: { id },
      relations: ['folder'],
    });
  }

  async findByFolderId(folderId: string) {
    return this.photoRepository.find({
      where: { folder: { id: folderId } },
      relations: ['folder'],
    });
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.findOne(id);
    if (!photo) {
      throw new Error('Photo not found');
    }
    Object.assign(photo, updatePhotoDto);
    return this.photoRepository.save(photo);
  }

  async remove(id: string) {
    const photo = await this.findOne(id);
    if (!photo) {
      throw new Error('Photo not found');
    }
    return this.photoRepository.remove(photo);
  }
}
