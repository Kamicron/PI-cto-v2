import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { Folder } from './entities/folder.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder]),
    ConfigModule
  ],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
