import { Test, TestingModule } from '@nestjs/testing';
import { MybetService } from './mybet.service';

describe('MybetService', () => {
  let service: MybetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MybetService],
    }).compile();

    service = module.get<MybetService>(MybetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
