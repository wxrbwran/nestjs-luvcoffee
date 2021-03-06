import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

// @Injectable()
// export class WrapReponseInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     console.log('before...');
//     // return next.handle().pipe(tap((data) => console.log('after...', data)));

//     return next.handle().pipe(map((data) => ({ data })));
//   }
// }

@Injectable()
export class WrapReponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          status: 'success',
        };
      }),
    );
  }
}
