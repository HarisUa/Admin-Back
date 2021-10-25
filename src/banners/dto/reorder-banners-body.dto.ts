import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReorderBannersBodyDto {
  @ApiProperty({ description: 'id of banner which we need to change' })
  @IsString()
  @IsNotEmpty()
  bannerId: string;

  @ApiProperty({ description: 'old sort order of given banner id', type: Number })
  @IsNumber()
  sortOrder: number;

  @ApiProperty({ description: 'new sort order of given banner id', type: Number })
  @IsNumber()
  newOrder: number;
}
