import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator';

import { LINK_REGEX } from '@common';

/**
 * Dto class for message button
 * @class MessageButtonDto
 */
class MybetButtonDto {
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
class MybetHtmlContentDto {
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
 * @extends {PartialType(MybetHtmlContentDto)}
 */
class PartialMybetHtmlContentDto extends PartialType(MybetHtmlContentDto) {}

/**
 * Dto class for message translation details
 * @class MessagePlDto
 */
class MybetPlDto {
  @ApiProperty({ description: 'title of message' })
  @IsString()
  email: string;

  @ApiProperty({ type: MybetHtmlContentDto })
  @Type(() => MybetHtmlContentDto)
  @ValidateNested()
  description: MybetHtmlContentDto;

  // @ApiProperty({ description: 'background image url for message' })
  // @IsString()
  // imageUrl: string;

  // @ApiProperty({ description: 'background image alternative text of message' })
  // @IsString()
  // imageAltText: string;

  @ApiPropertyOptional({ type: MybetButtonDto })
  @Type(() => MybetButtonDto)
  @ValidateNested()
  @IsOptional()
  primaryButton?: MybetButtonDto;
}

/**
 * Translation class for other languages than PL
 * @class MybetOtherLanguageDto
 * @extends {PartialType(MybetPlDto)}
 */
class MybetOtherLanguageDto extends PartialType(MybetPlDto) {
  @ApiPropertyOptional({ type: PartialMybetHtmlContentDto })
  @Type(() => PartialMybetHtmlContentDto)
  @ValidateNested()
  description?: MybetHtmlContentDto;
}

export class CreateMybetDto {
  @ApiProperty({ description: 'message name' })
  @IsNotEmpty()
  @IsString()
  mybetDescription: string;

  // @ApiProperty({ description: 'whether mark this message to send to all or not' })
  // @IsBoolean()
  // mybetStatus: boolean;

  // @ApiProperty({ description: 'included or excluded users based on send to all field', type: String, isArray: true })
  // @IsArray()
  // @IsString({ each: true })
  // includedExcludedUsers: string[];

  // @ApiProperty({ description: 'translation details for PL language' })
  // @Type(() => MybetPlDto)
  // @ValidateNested()
  // pl: MybetPlDto;

  @ApiPropertyOptional({ description: 'decide when to start showing message' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'decide when to end showing message and put it in history' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt?: Date;

  @ApiPropertyOptional({ description: 'whether to mark this message as active or not', type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  mybetStatus?: boolean;

  @ApiPropertyOptional({ description: 'promotion linked to this message' })
  @IsString()
  @IsOptional()
  promotionId?: string;

  // @ApiPropertyOptional({ description: 'translation details for EN language', type: MessageOtherLanguageDto })
  // @Type(() => MessageOtherLanguageDto)
  // @ValidateNested()
  // @IsOptional()
  // en?: MessageOtherLanguageDto;

  // @ApiPropertyOptional({ description: 'translation details for UK language', type: MessageOtherLanguageDto })
  // @Type(() => MessageOtherLanguageDto)
  // @ValidateNested()
  // @IsOptional()
  // uk?: MessageOtherLanguageDto;
}
