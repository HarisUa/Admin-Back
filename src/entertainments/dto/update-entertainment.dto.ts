import { PartialType } from '@nestjs/swagger';

import { CreateEntertainmentDto } from './create-entertainment.dto';

export class UpdateEntertainmentDto extends PartialType(CreateEntertainmentDto) {}
