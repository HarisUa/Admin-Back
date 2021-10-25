import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PromotionModel } from '@src/promotions/model/promotion.model';

import { MybetService } from './mybet.service';
import { MybetController } from './mybet.controller';
import { MybetModel } from './models/mybet.model';

@Module({
  controllers: [MybetController],
  providers: [MybetService],
  imports: [SequelizeModule.forFeature([MybetModel, PromotionModel])],
})
export class MybetModule {}
