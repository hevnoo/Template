import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('allFilter:', exception);
    // console.log(exception.response);
    //获取class-validator的校验提示信息
    const message = exception.response.message
      ? exception.response.message[0]
      : '';

    if (exception.name === 'TokenExpiredError') {
      // JWT令牌已过期
      return response.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Token expired',
      });
    }

    if (exception.name === 'JsonWebTokenError') {
      // JWT令牌格式错误或无效
      return response.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Invalid token',
      });
    }

    if (exception.name === 'Unauthorized') {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        msg: 'Unauthorized',
      });
    }

    // 其他错误
    return response.status(HttpStatus.UNAUTHORIZED).json({
      // code: HttpStatus.UNAUTHORIZED,
      code: exception.getStatus(),
      msg: message || '未知错误',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    // const status = exception.getStatus();
    // response.status(status).json({
    //   code: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   msg: '服务错误',
    // });
  }
}
