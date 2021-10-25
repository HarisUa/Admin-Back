import { Test, TestingModule } from '@nestjs/testing';
import { SubBannersController } from './sub-banners.controller';
import { SubBannersService } from './sub-banners.service';

describe('SubBannersController', () => {
  let controller: SubBannersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubBannersController],
      providers: [SubBannersService],
    }).compile();

    controller = module.get<SubBannersController>(SubBannersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
