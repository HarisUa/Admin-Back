import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { BannerModel } from './models/banner.model';

@Module({
  controllers: [BannersController],
  providers: [BannersService],
  imports: [SequelizeModule.forFeature([BannerModel])],
})
export class BannersModule {}
