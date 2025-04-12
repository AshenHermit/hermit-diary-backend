import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'user email',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'pass', description: 'password' })
  password: string;

  @ApiProperty({ example: 'Anna Lord', description: 'user name' })
  name: string;
}
