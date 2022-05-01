import {
  HttpCode,
  HttpException,
  Injectable,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { Model, Connection } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
    @InjectConnection()
    private readonly connection: Connection,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  findAll(limit: number, offset: number) {
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(_id: string) {
    const coffee = await this.coffeeModel.findOne({ _id });
    if (!coffee) {
      throw new NotFoundException(`Coffee ${_id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, coffee: UpdateCoffeeDto) {
    const oldCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: coffee }, { new: true })
      .exec();
    if (!oldCoffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return oldCoffee;
  }

  async deleteOne(id: string) {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }

  private async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      await recommendEvent.save({ session });
      await coffee.save({ session });
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
