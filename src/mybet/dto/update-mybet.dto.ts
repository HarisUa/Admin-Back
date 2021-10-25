import { PartialType } from '@nestjs/swagger';

import { CreateMybetDto } from './create-mybet.dto';

export class UpdateMybetDto extends PartialType(CreateMybetDto) {}
