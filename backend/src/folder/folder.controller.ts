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
    @Body('parentId') parentId?: string,
  ) {
    return this.folderService.create(name, parentId);
  }

  @Get()
  async getFolders() {
    return this.folderService.findAll();
  }

  // @Delete(':id')
  // async deleteFolder(@Param('id') id: number) {
  //   return this.folderService.delete(id);
  // }
}
