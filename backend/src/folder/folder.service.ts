import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private configService: ConfigService,
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
    try {
      const folders = await this.folderRepository.find({ relations: ['parent'] });
  
      const folderMap = new Map(folders.map(folder => [folder.id, { ...folder, children: [] }]));
  
      return folders.reduce<Folder[]>((roots, folder) => {
        if (folder.parent) {
          const parent = folderMap.get(folder.parent.id);
          if (parent) {
            parent.children.push(folderMap.get(folder.id)!);
          } else {
            console.error(`Parent not found for folder: ${folder.id}`);
          }
        } else {
          roots.push(folderMap.get(folder.id)!);
        }
        return roots;
      }, []);
    } catch (error) {
      console.error('Error fetching root folders:', error);
      throw new Error('Failed to fetch root folders');
    }
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
      folder.children = folder.children || []; // Toujours un tableau
      folder.photos = folder.photos || []; // Toujours un tableau
    }

    return folder;
  }

  async getFolderContent(folderId: string): Promise<{ folders: any[], photos: any[] }> {
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
      relations: ['children', 'photos'],
    });

    if (!folder) {
      throw new Error('Folder not found');
    }

    const baseUrl = this.configService.get('BACK_URL') || 'http://localhost:5001';

    const simpleFolders = folder.children.map(child => ({
      id: child.id,
      name: child.name,
      createdAt: child.createdAt
    }));

    const photosWithFullUrl = folder.photos.map(photo => ({
      ...photo,
      url: `${baseUrl}/uploads/${photo.url}`
    }));

    return {
      folders: simpleFolders,
      photos: photosWithFullUrl
    };
  }
}
