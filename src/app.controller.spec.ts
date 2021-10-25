import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return PONG message on ping call', () => {
      expect(appController.ping()).toMatchObject({ message: 'PONG' });
    });

    it('should return PONG message on pingV1 call', () => {
      expect(appController.pingV1()).toMatchObject({ message: 'PONG' });
    });
  });
});
