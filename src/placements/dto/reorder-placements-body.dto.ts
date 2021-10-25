import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReorderPlacementsBodyDto {
  @ApiProperty({ description: 'id of placement which we need to change' })
  @IsString()
  @IsNotEmpty()
  placementId: string;

  @ApiProperty({ description: 'old sort order of given placement id', type: Number })
  @IsNumber()
  sortOrder: number;

  @ApiProperty({ description: 'new sort order of given placement id', type: Number })
  @IsNumber()
  newOrder: number;
}
