import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @ApiProperty({ description: 'the coffee name' })
  readonly name: string;

  @IsString()
  @ApiProperty({ description: 'the coffee brand' })
  readonly brand: string;

  @IsString({ each: true })
  @ApiProperty({ description: 'the coffee flavors', example: ['apple'] })
  readonly flavors: string[];
}
