import { JWTPayload } from './interface/jwt-payload.interface';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  private logger = new Logger();
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '创建用户' })
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    // this.logger.verbose('log info');
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: '用户登录' })
  signiIn(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(createUserDto);
  }
}
