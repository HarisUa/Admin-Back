import { Test, TestingModule } from '@nestjs/testing';
import { MybetController } from './mybet.controller';
import { MybetService } from './mybet.service';

describe('MybetController', () => {
  let controller: MybetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MybetController],
      providers: [MybetService],
    }).compile();

    controller = module.get<MybetController>(MybetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
