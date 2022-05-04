import { GetUser } from './../common/decorators/get-user.decorator';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { CoffeesService } from './coffees.service';
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpStatus,
  HttpCode,
  Patch,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';

@Controller('coffees')
@UseGuards(AuthGuard())
@ApiTags('coffees')
// @UsePipes(ValidationPipe)
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  @Get()
  // @SetMetadata('isPublic', true)
  @ApiOperation({ summary: 'coffee列表' })
  @Public()
  // @ApiResponse({ status: 200, description: 'success' })
  findAll(@Protocol('https') protocol, @Query() query: PaginationQueryDto) {
    console.log('protocol', protocol);
    const { limit, offset } = query;
    return this.coffeesService.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id获取coffee' })
  @Public()
  findOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    console.log('user', user);
    return this.coffeesService.findOne(id);
  }

  // @UsePipes(ValidationPipe)
  @Post()
  // @HttpCode(HttpStatus.GONE)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  @Public()
  update(
    @Param('id') id: number,
    @Body(/**ValidationPipe */) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.coffeesService.deleteOne(id);
  }
}
