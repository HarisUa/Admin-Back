import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromotionModel } from './model/promotion.model';

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService],
  imports: [SequelizeModule.forFeature([PromotionModel])],
})
export class PromotionsModule {}
