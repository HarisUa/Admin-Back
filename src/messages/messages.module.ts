import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PromotionModel } from '@src/promotions/model/promotion.model';

import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageModel } from './models/message.model';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [SequelizeModule.forFeature([MessageModel, PromotionModel])],
})
export class MessagesModule {}
