import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({
  // providers: [
  //   {
  //     provide: 'CONNECTION',
  //     useValue: createConnection({
  //       type: 'postgres',
  // host: process.env.DATABASE_HOST,
  // port: +process.env.DATABASE_PORT,
  // username: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE_NAME,
  //     }),
  //   },
  // ],
})
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        },
      ],
    };
  }
}
