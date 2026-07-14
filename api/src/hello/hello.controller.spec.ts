import { Hello } from './entities/hello.entity';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';

describe('HelloController', () => {
  let controller: HelloController;

  const mockHelloModel = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [
        HelloService,
        {
          provide: getModelToken(Hello.name),
          useValue: mockHelloModel,
        },
      ],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
