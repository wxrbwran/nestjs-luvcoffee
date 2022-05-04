import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be  defined', () => {
    expect(service).toBeDefined();
  });
  describe('findOne', () => {
    describe('存在id时', () => {
      it('应该返回一个Coffee对象', async () => {
        const coffeeId = 1;
        const expectedCoffee = {};
        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('其他情况', () => {
      it('返回一个NotFoundException', async () => {
        const coffeeId = 1;
        coffeeRepository.findOne.mockReturnValue(undefined);
        // expect(service.findOne(coffeeId)).rejects.toThrow(
        //   `Coffee ${coffeeId} not found`,
        // );
        try {
          await service.findOne(coffeeId);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toEqual(`Coffee ${coffeeId} not found`);
        }
      });
    });
  });
});
