import { ManualService } from './manual.service';
import { configModule } from '@/utils/config';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, type TestingModule } from '@nestjs/testing';

describe('manualService', () => {
  let service: ManualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [configModule],
      providers: [ManualService],
    }).compile();

    service = module.get<ManualService>(ManualService);
  });

  it('should be defined', () => {
    expect.assertions(1);

    expect(service).toBeInstanceOf(ManualService);
  });
});
