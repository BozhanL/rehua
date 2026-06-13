import { AppController } from './app.controller';
import { AppService } from './app.service';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      typia.assert<number>(1);

      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

describe('typia', () => {
  it('should not raise an error', () => {
    typia.assert<number>(1);
  });
});
