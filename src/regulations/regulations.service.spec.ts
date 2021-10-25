import { Test, TestingModule } from '@nestjs/testing';
import { RegulationsService } from './regulations.service';

describe('RegulationsService', () => {
  let service: RegulationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegulationsService],
    }).compile();

    service = module.get<RegulationsService>(RegulationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
