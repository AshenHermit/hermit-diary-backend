import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => Diary, (diary) => diary.notes, { onDelete: 'CASCADE' })
  diary: Diary;
}
