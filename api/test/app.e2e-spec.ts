import { AppModule, mongoModule } from '@/app.module.js';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { assert, json, TypeGuardError } from 'typia';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env['MONGODB_URI'] = mongod.getUri();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(mongoModule)
      .useModule(MongooseModule.forRoot(mongod.getUri()))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(json.stringify('Hello World!'));
  });

  it('/hello (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/hello/')
      .set('Accept', 'application/json')
      .send({ id: '123', content: 'aaa' });
    expect(res.get('Content-Type')).toMatch(/json/);
    expect(res.status).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: '123',
        content: 'aaa',
        _id: expect.any(String),
      }),
    );
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
