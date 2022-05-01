import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  // main.ts 中加入
  //  transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  // 后， 不再需要 @Type
  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  offset: number;
}
