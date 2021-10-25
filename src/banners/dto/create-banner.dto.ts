import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator';

import { LINK_REGEX } from '@common';

/**
 * Dto class for banner translation details
 * @class BannerTranslationDto
 */
class BannerPlDto {
  @ApiProperty({ description: 'banner title to display' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'banner sub title to display' })
  @IsString()
  @IsOptional()
  subTitle?: string;

  @ApiProperty({ description: 'link to open when clicking on banner' })
  // @Matches(LINK_REGEX, { message: 'invalid link' })
  @ValidateIf((obj, value) => value !== '')
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'banner image url' })
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
 * @class BannerOtherLanguageDto
 * @extends {PartialType(BannerPlDto)}
 */
class BannerOtherLanguageDto extends PartialType(BannerPlDto) {}

export class CreateBannerDto {
  @ApiProperty({ description: 'name of banner' })
  @IsString()
  @IsNotEmpty()
  bannerName: string;

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => BannerPlDto)
  @ValidateIf((obj) => obj?.eventGameId === undefined)
  @ValidateNested()
  pl: BannerPlDto;

  @ApiPropertyOptional({ description: 'from when to start display', format: 'YYYY-MM-DDTHH:mm:ss.sssZ' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'from when to stop display', format: 'YYYY-MM-DDTHH:mm:ss.sssZ' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTill?: Date;

  @ApiPropertyOptional({ description: 'game id to bind to banner to display score. Fetch it from sb-betting api' })
  @IsString()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({ description: 'game type id from the available game types of event' })
  @IsNumber()
  @ValidateIf((obj) => !!obj.eventId)
  eventGameType: number;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: BannerOtherLanguageDto })
  @Type(() => BannerOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: BannerOtherLanguageDto;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: BannerOtherLanguageDto })
  @Type(() => BannerOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: BannerOtherLanguageDto;

  @ApiPropertyOptional({ description: 'to set to in-active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
