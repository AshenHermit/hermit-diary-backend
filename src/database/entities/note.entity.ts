import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Diary } from './diary.entity';

@Entity()
export class Note {
  @ApiProperty({ example: 1, description: 'Уникальный ID записи' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Untitled', description: 'Заголовок записи' })
  @Column({ default: 'Untitled' })
  name: string;

  @ApiProperty({
    example: 'true',
    description: 'is public',
  })
  @Column({ default: true })
  isPublic: boolean;

  @ApiProperty({
    example: 'true',
    description: 'is public',
  })
  @Column({ nullable: true, default: null, type: 'jsonb', select: false })
  content: Record<string, any>;

  @ManyToOne(() => Diary, (diary) => diary.notes, { onDelete: 'CASCADE' })
  diary: Diary;

  @ManyToMany(() => Note, (note) => note.incomingLinks, { cascade: true })
  @JoinTable()
  outcomingLinks: Note[];

  @ManyToMany(() => Note, (note) => note.outcomingLinks)
  incomingLinks: Note[];
}
