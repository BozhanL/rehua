import { AppModule } from '@/app.module.js';
import { JWT_COOKIE_NAME } from '@/auth/jwt.strategy';
import { User } from '@/schema/users/entities/user.entity';
import type { ExpressUser } from '@/utils/types';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { DynamicModule, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Model } from 'mongoose';
import os from 'node:os';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { assert, TypeGuardError } from 'typia';

describe('appController (e2e)', () => {
  let app: INestApplication<App>;
  let mongod: MongoMemoryServer | undefined;

  // Set timeout to 30s to allow MongoMemoryServer to download binary
  beforeAll(async () => {
    const arch = os.arch();

    // Skip MongoMemoryServer on arm64 architecture to avoid download issues on Mac ARM chips
    if (arch === 'arm64') {
      return;
    }
    mongod = await MongoMemoryServer.create();
    process.env['MONGODB_URI'] = mongod.getUri();
  }, 30 * 1000);

  beforeEach(async () => {
    let mongooseModule: DynamicModule | undefined;
    if (mongod) {
      mongooseModule = MongooseModule.forRoot(mongod.getUri(), {
        dbName: 'rehua',
      });
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.forRoot(mongooseModule)],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    await app.init();

    const userModel = app.get<Model<User>>(getModelToken(User.name));
    await userModel.create(
      new User(
        'ACB123',
        'John',
        'Doe',
        'password123',
        'QIG6JDKQ5KQTCPNHYP7TAPI56LHZXGED',
        'jd@hospital.com',
        'active',
        '0123456789',
        '123 magic street',
        'nurse',
      ),
    );
  });

  afterEach(async () => {
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    await userModel.deleteMany({}).exec();

    await app.close();
  });

  afterAll(async () => {
    if (mongod) {
      await mongod.stop();
    }
  });

  it('/hello (POST)', async () => {
    expect.assertions(3);

    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const user = await userModel.findOne().orFail().exec();

    const payload: ExpressUser = {
      userName: user.userName,
      group: 'admin',
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
