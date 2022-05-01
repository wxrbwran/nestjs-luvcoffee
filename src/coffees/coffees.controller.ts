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
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('coffees')
@ApiTags('coffees')
// @UsePipes(ValidationPipe)
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  @Get()
  // @SetMetadata('isPublic', true)
  @Public()
  // @ApiResponse({ status: 200, description: 'success' })
  findAll(@Protocol('https') protocol, @Query() query: PaginationQueryDto) {
    console.log('protocol', protocol);
    const { limit, offset } = query;
    return this.coffeesService.findAll(limit, offset);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
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
