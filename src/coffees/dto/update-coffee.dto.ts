import { CreateCoffeeDto } from './create-coffee.dto';
// export class UpdateCoffeeDto {
//   // readonly id: number;
//   readonly name?: string;
//   readonly brand?: string;
//   readonly flavors?: string[];
// }

import { PartialType } from '@nestjs/mapped-types';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
