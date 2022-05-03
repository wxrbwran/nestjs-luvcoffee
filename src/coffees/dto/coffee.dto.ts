import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CoffeeDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty({ description: 'the coffee name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'the coffee brand' })
  brand: string;

  @Expose()
  @ApiProperty({ description: 'the coffee flavors', example: ['apple'] })
  flavors: string[];
}
