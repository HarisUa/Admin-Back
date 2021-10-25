import { Test, TestingModule } from '@nestjs/testing';
import { SbBettingController } from './sb-betting.controller';
import { SbBettingService } from './sb-betting.service';

describe('SbBettingController', () => {
  let controller: SbBettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SbBettingController],
      providers: [SbBettingService],
    }).compile();

    controller = module.get<SbBettingController>(SbBettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
