import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator';
export class CreateMybetDto {
  @ApiProperty({ description: 'Comment' })
  @IsNotEmpty()
  @IsString()
  comment: string;
  @ApiProperty({ description: 'to accept mybet' })
  @IsBoolean()
  isActive: boolean;
}