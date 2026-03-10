import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const test_module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
    }).compile();

    controller = test_module.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
