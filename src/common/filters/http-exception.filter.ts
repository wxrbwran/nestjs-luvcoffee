import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);
    response.status(status).json({ ...error, ts: new Date().toISOString() });

    // const ctx = host.switchToHttp(); // 获取请求上下文
    // const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    // const status = exception.getStatus(); // 获取异常状态码
    // console.log('response', response);
    // // 设置错误信息
    // const message = exception.message
    //   ? exception.message
    //   : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    // const errorResponse = {
    //   data: {},
    //   message: message,
    //   status: 'failure',
    // };

    // // 设置返回的状态码， 请求头，发送错误信息
    // response.status(status);
    // response.header('Content-Type', 'application/json; charset=utf-8');
    // response.send(errorResponse);
  }
}
