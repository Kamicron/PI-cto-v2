import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {}

  async create(name: string, parentId?: string): Promise<Folder> {
    const folder = new Folder();
    folder.name = name;

    if (parentId) {
      const parent = await this.folderRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) throw new Error('Parent folder not found');
      folder.parent = parent;
    }

    return this.folderRepository.save(folder);
  }

  async findAll(): Promise<Folder[]> {
    return this.folderRepository.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: string): Promise<Folder> {
    return this.folderRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'photos'],
    });
  }

  async findRootFolders(): Promise<Folder[]> {
    return this.folderRepository
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.children', 'children')
      .where('folder.parent IS NULL')
      .getMany();
  }

  async findOrCreateFolder(name: string, parentId?: string): Promise<Folder> {
    // Chercher d'abord le dossier
    let folder: Folder;
    
    if (parentId) {
      folder = await this.folderRepository.findOne({
        where: { name, parent: { id: parentId } },
        relations: ['parent'],
      });
    } else {
      folder = await this.folderRepository.findOne({
        where: { name, parent: null },
      });
    }

    // Si le dossier n'existe pas, le créer
    if (!folder) {
      folder = await this.create(name, parentId);
    }

    return folder;
  }

  async updateName(id: string, newName: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({ where: { id } });

    if (!folder) {
      throw new Error('Folder not found');
    }

    folder.name = newName;
    return this.folderRepository.save(folder);
  }

  async findOneWithChildren(id: string): Promise<Folder> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'photos'],
    });

    if (folder) {
      folder.children = folder.children || [];
      folder.photos = folder.photos || [];
    }

    return folder;
  }
}
