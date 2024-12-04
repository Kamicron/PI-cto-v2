import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Delete,
  Param,
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
