import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ description: 'email of user' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password of user' })
  password: string;
}
