import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Applications API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('create -> simulate -> finalize flow', async () => {
    const created = await request(app.getHttpServer())
      .post('/applications')
      .send({
        customerDocument: '123456',
        customerName: 'Juan Test',
        channel: 'SELF_SERVICE',
        product: 'FREE_DESTINATION',
        requestedAmount: 15000,
        requestedTermMonths: 18,
      })
      .expect(201);

    const id = created.body.id as string;

    await request(app.getHttpServer())
      .post(`/applications/${id}/simulate-offer`)
      .expect(201);

    const finalized = await request(app.getHttpServer())
      .post(`/applications/${id}/finalize`)
      .expect(201);

    expect(finalized.body.status).toBe('FINALIZED');
  });
});
