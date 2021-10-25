import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { REGULATIONS_TYPES } from '../regulations.constants';

class RegulationPlDto {
  @ApiProperty({ description: 'title of regulation' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'regulation file url' })
  @IsString()
  fileUrl: string;
}

class RegulationOtherLanguageDto extends PartialType(RegulationPlDto) {}

export class CreateRegulationDto {
  @ApiProperty({ description: 'regulation name' })
  @IsNotEmpty()
  @IsString()
  regulationName: string;

  @ApiProperty({ description: 'regulation type', enum: REGULATIONS_TYPES })
  @IsEnum(REGULATIONS_TYPES)
  @IsNotEmpty()
  @IsString()
  type: REGULATIONS_TYPES;

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => RegulationPlDto)
  @ValidateNested()
  pl: RegulationPlDto;

  @ApiPropertyOptional({ description: 'decide whether to make regulation active or not' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: RegulationOtherLanguageDto })
  @Type(() => RegulationOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: Partial<RegulationPlDto>;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: RegulationOtherLanguageDto })
  @Type(() => RegulationOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: Partial<RegulationPlDto>;
}
