import { Module } from '@nestjs/common';
import { SubBannersService } from './sub-banners.service';
import { SubBannersController } from './sub-banners.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubBannerModel } from './models/sub-banner.model';

@Module({
  imports: [SequelizeModule.forFeature([SubBannerModel])],
  controllers: [SubBannersController],
  providers: [SubBannersService],
})
export class SubBannersModule {}
