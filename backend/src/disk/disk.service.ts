import { Injectable } from '@nestjs/common';
import * as disk from 'diskusage';

@Injectable()
export class DiskService {
  async getDiskUsage(
    path: string = '/',
  ): Promise<{ free: number; total: number }> {
    try {
      const { free, total } = disk.checkSync(path);
      return { free, total };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'espace disque: ${error.message}`,
      );
    }
  }
}
