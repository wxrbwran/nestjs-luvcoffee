import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名称必填' })
  @MinLength(4, { message: '用户名太短' })
  @MaxLength(20)
  @ApiProperty({ description: '用户名称' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: '用户名称必填' })
  @MinLength(6)
  @MaxLength(32)
  @ApiProperty({ description: '用户密码' })
  // @Matches(/[a-z]/)
  readonly password: string;
}
