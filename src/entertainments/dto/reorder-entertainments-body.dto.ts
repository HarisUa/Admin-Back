import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReorderEntertainmentsBodyDto {
  @ApiProperty({ description: 'id of entertainment which we need to change' })
  @IsString()
  @IsNotEmpty()
  entertainmentId: string;

  @ApiProperty({ description: 'old sort order of given entertainment id', type: Number })
  @IsNumber()
  sortOrder: number;

  @ApiProperty({ description: 'new sort order of given entertainment id', type: Number })
  @IsNumber()
  newOrder: number;
}
