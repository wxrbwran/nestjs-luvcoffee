import {
  HttpCode,
  HttpException,
  Injectable,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'ship roast',
      brand: 'buddy brew',
      flavors: ['choc', 'vanila'],
    },
  ];

  findAll(limit: number, offset: number) {
    return this.coffees;
  }

  findOne(id: number) {
    const coffee = this.coffees.find((item) => item.id === id);
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: string, coffee) {
    const oldCoffee = this.findOne(id);
    if (oldCoffee) {
      const newCoffee: Coffee = { ...oldCoffee, ...coffee };
    }
  }

  deleteOne(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
