import { Test, TestingModule } from '@nestjs/testing';
import { SubBannersService } from './sub-banners.service';

describe('SubBannersService', () => {
  let service: SubBannersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubBannersService],
    }).compile();

    service = module.get<SubBannersService>(SubBannersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
