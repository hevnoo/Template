import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class JwtAuthExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('jwt过滤器exception:', exception);

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

    // 其他错误
    return response.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      msg: 'Unauthorized',
    });
  }
}
