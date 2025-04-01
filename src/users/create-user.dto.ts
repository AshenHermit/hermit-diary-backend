import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'hashpass', description: 'Хэшированный пароль' })
  password: string;

  @ApiProperty({ example: 'Anna Lord', description: 'Имя пользователя' })
  name: string;
}
