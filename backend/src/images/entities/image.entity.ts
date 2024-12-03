import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Folder } from '../../folder/entities/folder.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Folder, (folder) => folder.children, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  folder: Folder;

  @CreateDateColumn()
  createdAt: Date;
}
