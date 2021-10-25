import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class GetEventGameTypesDto {
  @ApiProperty({ description: 'event id to find game types' })
  @IsNumberString()
  @IsNotEmpty()
  @IsString()
  eventId: string;
}
