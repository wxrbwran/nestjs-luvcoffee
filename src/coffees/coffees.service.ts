import { Event } from './../events/entities/event.entity';
import { Flavor } from './entities/flavor.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable(/** { scope: Scope.DEFAULT } */)
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject('COFFEE_BRAND') cofffeBrands: string[],
    private readonly configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log('cofffeBrands', cofffeBrands);
    const databaseHost = this.configService.get<string>(
      // 'DATABASE_HOST',
      'databse.host',
      'localhost',
    );
    console.log('databaseHost', databaseHost);

    // const coffeesConfig = this.configService.get<string>('coffees');
    // console.log('coffeesConfig', coffeesConfig);
    console.log(coffeesConfiguration.foo);
  }

  findAll(limit: number, offset: number) {
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('coffee', coffee);
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlaorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlaorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException('not found');
    }
    return this.coffeeRepository.save(coffee);
  }

  async deleteOne(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlaorByName(name: string): Promise<Flavor> {
    const oldFlavor = await this.flavorRepository.findOne({ where: { name } });
    if (oldFlavor) {
      return oldFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}

// private coffees: Coffee[] = [
//     {
//       id: 1,
//       name: 'ship roast',
//       brand: 'buddy brew',
//       flavors: ['choc', 'vanila'],
//     },
//   ];
