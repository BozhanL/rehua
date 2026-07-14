import { Hello } from './entities/hello.entity';
import { HelloService } from './hello.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';

describe('HelloService', () => {
  let service: HelloService;

  const mockHelloModel = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelloService,
        {
          provide: getModelToken(Hello.name),
          useValue: mockHelloModel,
        },
      ],
    }).compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
