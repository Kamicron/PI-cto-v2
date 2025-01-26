import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder])], // Enregistre l'entité Folder
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService], // Export FolderService pour qu'il soit disponible dans d'autres modules
})
export class FolderModule {}
