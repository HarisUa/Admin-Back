import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { EntertainmentsService } from './entertainments.service';
import { EntertainmentsController } from './entertainments.controller';
import { EntertainmentModel } from './model/entertainment.model';

@Module({
  imports: [SequelizeModule.forFeature([EntertainmentModel])],
  controllers: [EntertainmentsController],
  providers: [EntertainmentsService],
})
export class EntertainmentsModule {}
