import { Test, TestingModule } from '@nestjs/testing';
import { SbBettingService } from './sb-betting.service';

describe('SbBettingService', () => {
  let service: SbBettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbBettingService],
    }).compile();

    service = module.get<SbBettingService>(SbBettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
