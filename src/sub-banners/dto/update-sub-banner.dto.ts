import { PartialType } from '@nestjs/swagger';

import { CreateSubBannerDto } from './create-sub-banner.dto';

export class UpdateSubBannerDto extends PartialType(CreateSubBannerDto) {}
