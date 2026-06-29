import { AppModule } from '@/app.module.js';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { assert, json, TypeGuardError } from 'typia';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    process.env['MONGODB_URI'] = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(json.stringify('Hello World!'));
  });

  afterEach(async () => {
    await app.close();
    await mongod.stop();
  });
});

describe('typia', () => {
  it('should not raise an error', () => {
    expect(() => assert<number>(1)).not.toThrow();
    expect(assert<number>(1)).toBe(1);
  });

  it('should not raise an error', () => {
    expect(() => assert<string>(1 as unknown as string)).toThrow(
      TypeGuardError,
    );
  });
});
