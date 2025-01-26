import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  folderId: string;

  file: Express.Multer.File;
}
