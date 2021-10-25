import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PERMISSIONS } from '@common';

import { ArrayUnique, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name must be unique' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional({ description: 'Description of role' })
  @IsString()
  @IsOptional()
  roleDescription?: string;

  @ApiProperty({ description: 'Permissions to assign to role' })
  @IsArray()
  @IsString({ each: true })
  @IsEnum(PERMISSIONS, { each: true, message: 'One of permission is not valid' })
  @ArrayUnique()
  permissions: string[];

  @ApiProperty({ description: 'Whether this role have all permissions or not' })
  @IsBoolean()
  allPermissions: boolean = false;
}
