import { Test, TestingModule } from '@nestjs/testing';
import { PlacementsController } from './placements.controller';
import { PlacementsService } from './placements.service';

describe('PlacementsController', () => {
  let controller: PlacementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacementsController],
      providers: [PlacementsService],
    }).compile();

    controller = module.get<PlacementsController>(PlacementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
