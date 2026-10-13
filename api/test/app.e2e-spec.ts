import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import cookieParser from 'cookie-parser';
import { AppModule } from './../src/app.module.js';

describe('API routes (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  it('GET /health → ok', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect(/"status":"ok"/);
  });

  it('Unauthenticated admin writes → 401', async () => {
    await request(app.getHttpServer()).post('/admin/posts').send({ title: 'x' }).expect(401);
    await request(app.getHttpServer()).put('/admin/content/hero').send({ value: {} }).expect(401);
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('No register route exists', () => {
    return request(app.getHttpServer()).post('/auth/register').send({}).expect(404);
  });

  it('Login rejects bad credentials with shared message', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong' })
      .expect(401)
      .expect(/Invalid email or password/);
  });

  afterEach(async () => {
    await app.close();
  });
});
