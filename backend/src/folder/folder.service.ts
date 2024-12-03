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
}
