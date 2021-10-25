import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'first name of user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'last name of user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'email of user to identify' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `Minimum eight characters, at least one letter, one number and may contains only @#+ special characters. Pattern:- /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#_]{8,}$/`,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#_]{8,}$/, {
    message: 'Password must have minimum eight characters, at least one letter, one number and can contains on @#_ specials characters',
  })
  password: string;

  @ApiProperty({ description: 'roles assign to user' })
  @IsArray()
  @IsNumber({}, { each: true })
  rolesIds: number[];
}
