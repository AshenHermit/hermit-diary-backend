import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Diary {
  @ApiProperty({ example: 1, description: 'Уникальный ID дневника' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Untitled', description: 'Имя дневника' })
  @Column({ default: 'Untitled' })
  name: string;

  @ApiProperty({
    example: 'https://site.com/picture.webp',
    description: 'picture',
  })
  @Column({ default: '' })
  picture: string;

  @ApiProperty({
    example: 'true',
    description: 'is public',
  })
  @Column({ default: true })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.diaries, { onDelete: 'CASCADE' })
  user: User;
}
