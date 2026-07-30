import { AppModule } from '@/app.module.js';
import type { JwtContent } from '@/auth/entities/jwt-content.entity';
import { JWT_COOKIE_NAME } from '@/auth/jwt.strategy';
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
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { assert, json, TypeGuardError } from 'typia';

describe('appController (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer;

  // Set timeout to 30s to allow MongoMemoryServer to download binary
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    process.env['MONGODB_URI'] = mongod.getUri();
  }, 30 * 1000);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule.forRoot(
          MongooseModule.forRoot(mongod.getUri(), { dbName: 'rehua' }),
        ),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('/ (GET)', async () => {
    expect.assertions(2);

    const res = await request(app.getHttpServer()).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe(json.stringify('Hello World!'));
  });

  it('/hello (POST)', async () => {
    expect.assertions(3);

    const payload: JwtContent = {
      userId: 1,
    };

    const jwtService = app.get(JwtService);
    const token = jwtService.sign(payload);

    const res = await request(app.getHttpServer())
      .post('/hello/')
      .set('Accept', 'application/json')
      .set('Cookie', [`${JWT_COOKIE_NAME}=${token}`])
      .send({ id: '123', content: 'aaa' });

    expect(res.get('Content-Type')).toMatch(/json/);
    expect(res.status).toBe(201);
    expect(res.body).toStrictEqual(
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
