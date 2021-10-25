import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RegulationsService } from './regulations.service';
import { RegulationsController } from './regulations.controller';
import { RegulationModel } from './models/regulation.model';

@Module({
  controllers: [RegulationsController],
  providers: [RegulationsService],
  imports: [SequelizeModule.forFeature([RegulationModel])],
})
export class RegulationsModule {}
