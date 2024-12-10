import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { DiskController } from './disk.controller';

@Module({
  controllers: [DiskController],
  providers: [DiskService],
})
export class DiskModule {}
