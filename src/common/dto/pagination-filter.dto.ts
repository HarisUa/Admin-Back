import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNumberString, IsOptional, IsString, ValidateIf } from 'class-validator';

export class PaginationFilterDto {
  @ApiPropertyOptional({ description: 'no of records to fetch' })
  @IsNumberString()
  @ValidateIf((o, v) => v !== '')
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ description: 'from where to start fetch' })
  @IsNumberString()
  @ValidateIf((o, v) => v !== '')
  @IsOptional()
  offset?: string;

  @ApiPropertyOptional({ description: 'give sort order', default: 'desc' })
  @IsString()
  @IsIn(['desc', 'asc', ''])
  @Transform((param) => {
    if (typeof param.value !== 'string') {
      return param.value;
    }
    return param.value.toUpperCase();
  })
  @IsOptional()
  order?: string;

  @ApiPropertyOptional({ description: 'give field name to sort', default: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  /**
   * To fetch pagination information
   * @param {number} [defaultLimit=20] default limit if not provided
   * @param {string} [defaultOrder='DESC'] default order if not provided
   * @return pagination query details
   */
  getPaginationInfo(defaultLimit: number = 20, defaultOrder: string = 'DESC') {
    // define limit, offset and order
    const limit = +(this.limit || defaultLimit);
    const offset = +(this.offset || 0);
    const order = this.order || defaultOrder;

    return { limit, offset, order, sortBy: this.sortBy };
  }
}
