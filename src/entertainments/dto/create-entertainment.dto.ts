import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

import { ENTERTAINMENT_CATEGORIES } from '../entertainment.constant';

/**
 * For translations fields of entertainments
 * @class EntertainmentPlDto
 */
class EntertainmentPlDto {
  @ApiProperty({ description: 'title of entertainment' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ description: 'sub title of entertainment' })
  @IsString()
  @IsOptional()
  subTitle?: string;

  @ApiPropertyOptional({ description: 'background image url for entertainment' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'banner image url alternative text' })
  @IsString()
  @IsOptional()
  imageAltText?: string;
}

/**
 * Translation class for other languages than PL
 * @class EntertainmentOtherLanguageDto
 * @extends {PartialType(EntertainmentPlDto)}
 */
class EntertainmentOtherLanguageDto extends PartialType(EntertainmentPlDto) {}

export class CreateEntertainmentDto {
  @ApiProperty({ description: 'name of entertainment' })
  @IsString()
  @IsNotEmpty()
  entertainmentName: string;

  @ApiProperty({ description: 'category in which entertainment exist', enum: Object.keys(ENTERTAINMENT_CATEGORIES) })
  @IsEnum(ENTERTAINMENT_CATEGORIES, { message: 'Category is not valid' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => EntertainmentPlDto)
  @ValidateIf((obj) => obj?.eventGameId === undefined)
  @ValidateNested()
  pl: EntertainmentPlDto;

  @ApiProperty({ description: 'event game id of sb betting for entertainment' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ description: 'game type id from the available game types of event' })
  @IsNumber()
  eventGameType: number;

  @ApiPropertyOptional({ description: 'decide when to start showing entertainment' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'decide when to end showing entertainment' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTill?: Date;

  @ApiPropertyOptional({ description: 'order of entertainment' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: EntertainmentOtherLanguageDto })
  @Type(() => EntertainmentOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: EntertainmentOtherLanguageDto;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: EntertainmentOtherLanguageDto })
  @Type(() => EntertainmentOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: EntertainmentOtherLanguageDto;

  @ApiPropertyOptional({ description: 'to make entertainment inactive' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
