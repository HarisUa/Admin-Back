import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { LINK_REGEX } from '@common';

import { PLACEMENT_SCREENS } from '../placements.constants';

/**
 * For translations fields of placements
 * @class PlacementPlDto
 */
class PlacementPlDto {
  @ApiProperty({ description: 'image background of placement' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'placement image url alternative text' })
  @IsString()
  imageAltText: string;

  @ApiProperty({ description: 'title of placement' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'sub-title of placement' })
  @IsString()
  @IsOptional()
  subTitle?: string;

  @ApiPropertyOptional({ description: 'link to redirect when user click on placement' })
  // @Matches(LINK_REGEX, { message: 'invalid link' })
  @ValidateIf((obj, value) => value !== '')
  @IsString()
  @IsOptional()
  link?: string;
}

/**
 * Translation class for other languages than PL
 * @class PlacementOtherLanguageDto
 * @extends {PartialType(PlacementPlDto)}
 */
class PlacementOtherLanguageDto extends PartialType(PlacementPlDto) {}

export class CreatePlacementDto {
  @ApiProperty({ description: 'placement name' })
  @IsNotEmpty()
  @IsString()
  placementName: string;

  @ApiProperty({ description: 'to decide on which screens to display' })
  @IsEnum(PLACEMENT_SCREENS, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  screens: string[];

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => PlacementPlDto)
  @ValidateNested()
  pl: PlacementPlDto;

  @ApiPropertyOptional({ description: 'decide when to start showing placement' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'decide when to end showing placement' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTill?: Date;

  @ApiPropertyOptional({ description: 'decide whether to make placement active or not' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: PlacementOtherLanguageDto })
  @Type(() => PlacementOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: PlacementOtherLanguageDto;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: PlacementOtherLanguageDto })
  @Type(() => PlacementOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: PlacementOtherLanguageDto;
}
