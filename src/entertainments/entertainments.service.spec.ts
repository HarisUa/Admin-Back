import { Test, TestingModule } from '@nestjs/testing';
import { EntertainmentsService } from './entertainments.service';

describe('EntertainmentsService', () => {
  let service: EntertainmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntertainmentsService],
    }).compile();

    service = module.get<EntertainmentsService>(EntertainmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
