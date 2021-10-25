import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, ValidateIf } from 'class-validator';

import { BooleanString, PaginationFilterDto } from '@common';

export class GetRegulationQueryDto extends PaginationFilterDto {
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsBooleanString()
  @ValidateIf((o, v) => v !== '')
  @IsOptional()
  isActive?: BooleanString;
}
