import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';

export const GetUser = createParamDecorator(
  (_data: any, ctx: ExecutionContext): User => {
    // console.log({ defaultValue });
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
