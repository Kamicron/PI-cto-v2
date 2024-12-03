import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder])], // Enregistre l'entité Folder
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
