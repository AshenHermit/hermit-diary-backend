import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ example: 'pass', description: 'password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'name', description: 'user name', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
