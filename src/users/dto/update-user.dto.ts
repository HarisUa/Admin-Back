import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
  @ApiPropertyOptional({ description: 'to make user inactive' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
