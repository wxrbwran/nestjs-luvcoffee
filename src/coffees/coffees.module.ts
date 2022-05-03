import { AuthModule } from './../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Flavor } from './entities/flavor.entity';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Module, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { Connection } from 'typeorm';
import coffeesConfig from './config/coffees.config';

// @Injectable()
// export class CoffeeBrandFactory {
//   create() {
//     // do sth...
//     return ['buddy brew', 'nescafe'];
//   }
// }

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
    AuthModule,
  ],
  controllers: [CoffeesController],
  // providers: [CoffeesService],
  providers: [
    {
      provide: CoffeesService,
      useClass: CoffeesService,
    },
    // {
    //   provide: 'COFFEE_BRAND',
    //   useValue: ['buddy brew', 'nescafe'],
    // },
    // {
    //   provide: 'COFFEE_BRAND',
    //   useFactory: () => ['buddy brew', 'nescafe'],
    // },
    {
      provide: 'COFFEE_BRAND',
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const brands = await connection.query('select * ...');
        const brands = await Promise.resolve(['buddy brew', 'nescafe']);
        console.log('async!');
        return brands;
      },
      inject: [Connection],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
