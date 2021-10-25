import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator';

import { LINK_REGEX } from '@common';

/**
 * Dto class for promotion button
 * @class PromotionButtonDto
 */
class PromotionButtonDto {
  @ApiProperty({ description: 'button text' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'button click link' })
  @Matches(LINK_REGEX, { message: 'invalid link' })
  @ValidateIf((obj, value) => value !== '')
  @IsString()
  link: string;
}

/**
 * Dto class for html contents of promotion
 * @class PromotionHtmlContentDto
 */
class PromotionHtmlContentDto {
  @ApiProperty({ description: 'html content of promotion' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'is ready html of promotion' })
  @IsBoolean()
  isReadyHtml: boolean;
}

/**
 * DTO class for option html contents of promotion
 * @class PartialPromotionHtmlContentDto
 * @extends {PartialType(PromotionHtmlContentDto)}
 */
class PartialPromotionHtmlContentDto extends PartialType(PromotionHtmlContentDto) {}

/**
 * Dto class for promotion translation details
 * @class PromotionPlDto
 */
class PromotionPlDto {
  @ApiProperty({ description: 'title of promotion' })
  @IsString()
  title: string;

  @ApiProperty({ type: PromotionHtmlContentDto })
  @Type(() => PromotionHtmlContentDto)
  @ValidateNested()
  description: PromotionHtmlContentDto;

  @ApiProperty({ description: 'summary of promotion' })
  @IsString()
  summary: string;

  @ApiProperty({ description: 'background image url for promotion' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'background image alternative text of promotion' })
  @IsString()
  imageAltText: string;

  @ApiPropertyOptional({ type: PromotionButtonDto })
  @Type(() => PromotionButtonDto)
  @ValidateNested()
  @IsOptional()
  primaryButton?: PromotionButtonDto;
}

/**
 * Translation class for other languages than PL
 * @class PromotionOtherLanguageDto
 * @extends {PartialType(PromotionPlDto)}
 */
class PromotionOtherLanguageDto extends PartialType(PromotionPlDto) {
  @ApiPropertyOptional({ type: PartialPromotionHtmlContentDto })
  @Type(() => PartialPromotionHtmlContentDto)
  @ValidateNested()
  description?: PromotionHtmlContentDto;
}

export class CreatePromotionDto {
  @ApiProperty({ description: 'promotion name' })
  @IsNotEmpty()
  @IsString()
  promotionName: string;

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => PromotionOtherLanguageDto)
  @ValidateNested()
  pl: PromotionOtherLanguageDto;

  @ApiPropertyOptional({ description: 'decide when to start showing promotion' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'decide when to end showing promotion' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTill?: Date;

  @ApiPropertyOptional({ description: 'order of promotion' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'whether mark this promotion as active or not', type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: PromotionOtherLanguageDto })
  @Type(() => PromotionOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: PromotionOtherLanguageDto;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: PromotionOtherLanguageDto })
  @Type(() => PromotionOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: PromotionOtherLanguageDto;
}
