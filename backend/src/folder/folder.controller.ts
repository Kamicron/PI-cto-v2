import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Delete,
  Param, Patch, NotFoundException, BadRequestException
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('folders')
@UseGuards(AuthGuard('jwt')) // Protéger toutes les routes par le token JWT
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('create')
  async createFolder(
    @Body('name') name: string,
    @Body('parentId') parentId?: number,
  ) {
    return this.folderService.create(name, parentId?.toString());
  }

  @Get()
  async getRootFolders() {
    return this.folderService.findRootFolders();
  }
  

  @Get(':id')
  async getFolderWithChildren(@Param('id') id: string) {
    const folder = await this.folderService.findOneWithChildren(id);

    if (!folder) {
      throw new Error(`Le dossier avec l'ID ${id} n'existe pas.`);
    }

    return folder;
  }

  @Get(':id/content')
  async getFolderContent(@Param('id') id: string) {
    return this.folderService.getFolderContent(id);
  }

  @Patch(':id/name')
  async updateFolderName(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    if (!name || name.trim().length < 3) {
      throw new BadRequestException(
        'Le nom du dossier doit contenir au moins 3 caractères.',
      );
    }
    
    const updatedFolder = await this.folderService.updateName(id, name.trim());
  
    if (!updatedFolder) {
      throw new NotFoundException(`Le dossier avec l'ID ${id} n'existe pas.`);
    }
  
    return updatedFolder;
  }

  @Delete(':id')
  async deleteFolder(@Param('id') id: string) {
    try {
      await this.folderService.deleteFolder(id);
      return { message: 'Folder and all its contents have been deleted successfully' };
    } catch (error) {
      throw new NotFoundException(`Failed to delete folder: ${error.message}`);
    }
  }

  // @Get()
  // async getFolders() {
  //   return this.folderService.findAll();
  // }

  // @Get(':id')
  // async getFolder(@Param('id') id: string) {
  //   const folder = await this.folderService.findOne(id);

  //   if (!folder) {
  //     throw new Error(`Le dossier avec l'ID ${id} n'existe pas.`);
  //   }

  //   return folder;
  // }

  // @Delete(':id')
  // async deleteFolder(@Param('id') id: number) {
  //   return this.folderService.delete(id);
  // }
}
