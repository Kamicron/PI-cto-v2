import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Folder } from '../../folder/entities/folder.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string; // Le chemin de stockage de l'image

  @ManyToOne(() => Folder, (folder) => folder.id, { nullable: true })
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @CreateDateColumn()
  createdAt: Date;
}
