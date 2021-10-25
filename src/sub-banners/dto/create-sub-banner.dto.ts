import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, ValidateIf, ValidateNested } from 'class-validator';

import { LINK_REGEX } from '@common';

/**
 * For translations fields of sub banner
 * @class SubBannerPlDto
 */
class SubBannerPlDto {
  @ApiProperty({ description: 'link to redirect when user click on sub-banner' })
  // @Matches(LINK_REGEX, { message: 'invalid link' })
  @ValidateIf((obj, value) => value !== '')
  @IsString()
  link: string;

  @ApiProperty({ description: 'sub-banner image url' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'sub-banner image url alternative text' })
  @IsString()
  imageAltText: string;

  @ApiPropertyOptional({ description: 'title of sub-banner' })
  @MaxLength(50)
  @IsString()
  @IsOptional()
  title?: string;
}

/**
 * Translation class for other languages than PL
 * @class SubBannerOtherLanguageDto
 * @extends {PartialType(SubBannerPlDto)}
 */
class SubBannerOtherLanguageDto extends PartialType(SubBannerPlDto) {}

export class CreateSubBannerDto {
  @ApiProperty({ description: 'name of sub-banner' })
  @IsString()
  @IsNotEmpty()
  subBannerName: string;

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => SubBannerPlDto)
  @ValidateNested()
  pl: SubBannerPlDto;

  @ApiPropertyOptional({ description: 'from when to start display' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'from when to stop display' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateTill?: Date;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: SubBannerOtherLanguageDto })
  @Type(() => SubBannerOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: SubBannerOtherLanguageDto;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: SubBannerOtherLanguageDto })
  @Type(() => SubBannerOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: SubBannerOtherLanguageDto;

  @ApiPropertyOptional({ description: 'to make sub banner inactive' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
