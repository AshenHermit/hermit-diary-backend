import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Уникальный ID пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashpass', description: 'Хэшированный пароль' })
  @Column()
  password: string;

  @ApiProperty({ example: 'Anna Lord', description: 'Имя пользователя' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'https://site.com/picture.webp',
    description: 'picture',
  })
  @Column({ default: '' })
  picture: string;

  @ApiProperty({
    example: 'google',
    description: 'Сервис авторизации',
  })
  @Column({ default: 'email' })
  service: 'email' | 'google' | 'vk' | 'yandex' | 'github';
}
