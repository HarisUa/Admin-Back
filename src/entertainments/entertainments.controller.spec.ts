import { Test, TestingModule } from '@nestjs/testing';
import { EntertainmentsController } from './entertainments.controller';
import { EntertainmentsService } from './entertainments.service';

describe('EntertainmentsController', () => {
  let controller: EntertainmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntertainmentsController],
      providers: [EntertainmentsService],
    }).compile();

    controller = module.get<EntertainmentsController>(EntertainmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
