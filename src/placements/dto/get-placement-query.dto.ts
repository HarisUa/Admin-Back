import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { GET_RECORDS_QUERY_STATUSES, PaginationFilterDto } from '@common';

export class GetPlacementQueryDto extends PaginationFilterDto {
  @ApiProperty({ description: 'status of records to fetch', enum: Object.values(GET_RECORDS_QUERY_STATUSES) })
  @IsEnum(GET_RECORDS_QUERY_STATUSES)
  status: GET_RECORDS_QUERY_STATUSES;
}
