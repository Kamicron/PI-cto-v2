import { Controller, Get } from '@nestjs/common';
import { DiskService } from './disk.service';

@Controller('disk')
export class DiskController {
  constructor(private readonly diskService: DiskService) {}

  @Get('usage')
  async getDiskUsage() {
    return this.diskService.getDiskUsage();
  }
}
