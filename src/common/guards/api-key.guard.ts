import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from './../decorators/public.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    // console.log('request.headers', request.headers);
    // console.log('authHeader', authHeader);
    return authHeader === this.configService.get('API_KEY');
  }
}
