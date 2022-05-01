import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'shipe swa',
    brand: 'buddy brew',
    flavors: ['choc', 'vanilla'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '123456',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', () => {
    return (
      request(app.getHttpServer())
        .post('/coffees')
        // .set('Authorization', process.env.API_KEY)
        .send(coffee as CreateCoffeeDto)
        // .expect(200)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedCoffee = jasmine.objectContaining({
            ...coffee,
            flavors: jasmine.arrayContaining(
              coffee.flavors.map((name) => jasmine.objectContaining({ name })),
            ),
          });
          expect(body).toEqual(expectedCoffee);
        })
    );
  });
  it.todo('Get All [GET /]');
  it.todo('Get One [GET /:id]');
  it.todo('Update One [PATCH /:id]');
  it.todo('Delete One [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
