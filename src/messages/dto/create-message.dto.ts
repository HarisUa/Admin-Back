import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator';

import { LINK_REGEX } from '@common';

/**
 * Dto class for message button
 * @class MessageButtonDto
 */
class MessageButtonDto {
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
 * Dto class for html contents of message
 * @class MessageHtmlContentDto
 */
class MessageHtmlContentDto {
  @ApiProperty({ description: 'html content of message' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'is ready html of message' })
  @IsBoolean()
  isReadyHtml: boolean;
}

/**
 * DTO class for option html contents of message
 * @class PartialMessageHtmlContentDto
 * @extends {PartialType(MessageHtmlContentDto)}
 */
class PartialMessageHtmlContentDto extends PartialType(MessageHtmlContentDto) {}

/**
 * Dto class for message translation details
 * @class MessagePlDto
 */
class MessagePlDto {
  @ApiProperty({ description: 'title of message' })
  @IsString()
  title: string;

  @ApiProperty({ type: MessageHtmlContentDto })
  @Type(() => MessageHtmlContentDto)
  @ValidateNested()
  description: MessageHtmlContentDto;

  @ApiProperty({ description: 'background image url for message' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'background image alternative text of message' })
  @IsString()
  imageAltText: string;

  @ApiPropertyOptional({ type: MessageButtonDto })
  @Type(() => MessageButtonDto)
  @ValidateNested()
  @IsOptional()
  primaryButton?: MessageButtonDto;
}

/**
 * Translation class for other languages than PL
 * @class MessageOtherLanguageDto
 * @extends {PartialType(MessagePlDto)}
 */
class MessageOtherLanguageDto extends PartialType(MessagePlDto) {
  @ApiPropertyOptional({ type: PartialMessageHtmlContentDto })
  @Type(() => PartialMessageHtmlContentDto)
  @ValidateNested()
  description?: MessageHtmlContentDto;
}

export class CreateMessageDto {
  @ApiProperty({ description: 'message name' })
  @IsNotEmpty()
  @IsString()
  messageName: string;

  @ApiProperty({ description: 'whether mark this message to send to all or not' })
  @IsBoolean()
  sendToAll: boolean;

  @ApiProperty({ description: 'included or excluded users based on send to all field', type: String, isArray: true })
  @IsArray()
  @IsString({ each: true })
  includedExcludedUsers: string[];

  @ApiProperty({ description: 'translation details for PL language' })
  @Type(() => MessagePlDto)
  @ValidateNested()
  pl: MessagePlDto;

  @ApiPropertyOptional({ description: 'decide when to start showing message' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateFrom?: Date;

  @ApiPropertyOptional({ description: 'decide when to end showing message and put it in history' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateTill?: Date;

  @ApiPropertyOptional({ description: 'whether to mark this message as active or not', type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'promotion linked to this message' })
  @IsString()
  @IsOptional()
  promotionId?: string;

  @ApiPropertyOptional({ description: 'translation details for EN language', type: MessageOtherLanguageDto })
  @Type(() => MessageOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  en?: MessageOtherLanguageDto;

  @ApiPropertyOptional({ description: 'translation details for UK language', type: MessageOtherLanguageDto })
  @Type(() => MessageOtherLanguageDto)
  @ValidateNested()
  @IsOptional()
  uk?: MessageOtherLanguageDto;
}
