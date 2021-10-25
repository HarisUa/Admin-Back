import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({ description: 'decide whether to make role active or not, it will remove role from each user where assigned' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
