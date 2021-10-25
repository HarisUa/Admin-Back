import { Module } from '@nestjs/common';
import { SbBettingService } from './sb-betting.service';
import { SbBettingController } from './sb-betting.controller';

@Module({
  controllers: [SbBettingController],
  providers: [SbBettingService],
})
export class SbBettingModule {}
