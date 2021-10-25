import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlacementsService } from './placements.service';
import { PlacementsController } from './placements.controller';
import { PlacementModel } from './models/placement.model';

@Module({
  controllers: [PlacementsController],
  providers: [PlacementsService],
  imports: [SequelizeModule.forFeature([PlacementModel])],
})
export class PlacementsModule {}
