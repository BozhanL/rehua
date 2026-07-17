import { AppController } from './app.controller';
import { AppService } from './app.service';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, type TestingModule } from '@nestjs/testing';
import { assert, TypeGuardError } from 'typia';

describe('appController', () => {
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
      expect.assertions(1);

      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

describe('typia', () => {
  it('should not raise an error', () => {
    expect.assertions(2);

    expect(() => assert<number>(1)).not.toThrow();
    expect(assert<number>(1)).toBe(1);
  });

  it('should raise an error', () => {
    expect.assertions(1);

    expect(() => assert<string>(1 as unknown as string)).toThrow(
      TypeGuardError,
    );
  });
});
