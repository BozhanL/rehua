import { ManualService } from './manual.service';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

describe('manualService', () => {
  let service: ManualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ManualService],
    }).compile();

    service = module.get<ManualService>(ManualService);
  });

  it('should be defined', () => {
    expect.assertions(1);

    expect(service).toBeInstanceOf(ManualService);
  });
});
