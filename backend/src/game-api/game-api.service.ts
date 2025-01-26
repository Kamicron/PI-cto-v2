import { Injectable, NotFoundException } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { PhotosService } from '../photos/photos.service';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { Photo } from '../photos/entities/photo.entity';

@Injectable()
export class GameApiService {
  constructor(
    private readonly folderService: FolderService,
    private readonly photosService: PhotosService,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  public async ensureGameFolderStructure(apiKey: string, playerId: string) {
    // Récupérer les informations de l'API key pour avoir le nom du jeu
    const gameInfo = await this.apiKeysService.findByKey(apiKey);
    if (!gameInfo) {
      throw new NotFoundException('Invalid API key');
    }

    // Créer/récupérer le dossier du jeu
    const gameFolder = await this.folderService.findOrCreateFolder(
      gameInfo.serviceName,
      null, // pas de parent pour le dossier du jeu
    );

    // Créer/récupérer le dossier "players"
    const playersFolder = await this.folderService.findOrCreateFolder(
      'players',
      gameFolder.id,
    );

    // Créer/récupérer le dossier du joueur
    const playerFolder = await this.folderService.findOrCreateFolder(
      playerId,
      playersFolder.id,
    );

    return playerFolder;
  }

  async uploadProfilePicture(apiKey: string, playerId: string, file: Express.Multer.File) {
    const playerFolder = await this.ensureGameFolderStructure(apiKey, playerId);

    // Supprimer l'ancienne photo si elle existe
    const existingPhotos = await this.photosService.findByFolderId(playerFolder.id);
    for (const photo of existingPhotos) {
      await this.photosService.remove(photo.id);
    }

    // Sauvegarder la nouvelle photo
    const photo = await this.photosService.create({
      name: 'profile.png',
      file,
      folderId: playerFolder.id,
    });

    return {
      success: true,
      photoId: photo.id,
      fileName: photo.name,
    };
  }

  async getProfilePicture(apiKey: string, playerId: string): Promise<Photo> {
    const playerFolder = await this.ensureGameFolderStructure(apiKey, playerId);
    const photos = await this.photosService.findByFolderId(playerFolder.id);
    
    if (!photos || photos.length === 0) {
      throw new NotFoundException('No profile picture found');
    }

    return photos[0];
  }

  async deleteProfilePicture(apiKey: string, playerId: string) {
    const playerFolder = await this.ensureGameFolderStructure(apiKey, playerId);
    const photos = await this.photosService.findByFolderId(playerFolder.id);
    
    for (const photo of photos) {
      await this.photosService.remove(photo.id);
    }
  }
}
