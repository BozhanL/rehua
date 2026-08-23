import { ManualController } from './manual.controller';
import { ManualService } from './manual.service';
import { configModule } from '@/app.module';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, type TestingModule } from '@nestjs/testing';

describe('manualController', () => {
  let controller: ManualController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [configModule],
      controllers: [ManualController],
      providers: [ManualService],
    }).compile();

    controller = module.get<ManualController>(ManualController);
  });

  it('should be defined', () => {
    expect.assertions(1);

    expect(controller).toBeInstanceOf(ManualController);
  });
});
