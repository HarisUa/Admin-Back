import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReorderPromotionsBodyDto {
  @ApiProperty({ description: 'id of promotion which we need to change' })
  @IsString()
  @IsNotEmpty()
  promotionId: string;

  @ApiProperty({ description: 'old sort order of given promotion id', type: Number })
  @IsNumber()
  sortOrder: number;

  @ApiProperty({ description: 'new sort order of given promotion id', type: Number })
  @IsNumber()
  newOrder: number;
}
