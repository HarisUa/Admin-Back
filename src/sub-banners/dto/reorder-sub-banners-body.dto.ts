import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReorderSubBannersBodyDto {
  @ApiProperty({ description: 'id of sub banner which we need to change' })
  @IsString()
  @IsNotEmpty()
  subBannerId: string;

  @ApiProperty({ description: 'old sort order of give sub banner id', type: Number })
  @IsNumber()
  sortOrder: number;

  @ApiProperty({ description: 'new sort order of give sub banner id', type: Number })
  @IsNumber()
  newOrder: number;
}
