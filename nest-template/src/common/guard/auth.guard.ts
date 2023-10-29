//   /src/common/guards/auth.guard.ts
// 继承jwt并全局注册,在其中判断接口是否具有第一步中的注解参数isPublic，有则直接放行，没有则交由我们继承的jwt，由jwt判断token，最终返回401或放行。

import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
// import { JwtAuthExceptionFilter } from 'src/common/filter/auth-exceptions.filter';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService, // private readonly exceptionFilter: JwtAuthExceptionFilter, // 注入错误过滤器
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // console.log(request.headers);
    //获取token
    const token = this.extractToken(request);
    //校验token
    // return this.validateToken(token, request);
    try {
      // 校验token
      const isValid = await this.validateToken(token, request);
      if (!isValid) {
        // 手动调用错误过滤器
        // this.exceptionFilter.catch(new Error('Unauthorized'), context);
        // throw new UnauthorizedException(); // 抛出UnauthorizedException异常
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED); // 使用 HttpException 抛出异常
      }
      return isValid;
    } catch (err) {
      // 手动调用错误过滤器
      // this.exceptionFilter.catch(err, context);
      // 抛出一个异常，让 Nest.js 框架自动处理异常并返回相应的错误响应。可以通过抛出 UnauthorizedException 来实现
      // throw new UnauthorizedException(); // 抛出UnauthorizedException异常
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED); // 使用 HttpException 抛出异常
      return false;
    }
  }

  private extractToken(request: any): string | null {
    const { cookie, authorization: authHeader } = request.headers;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // 去除 'Bearer ' 前缀，获取纯token
    } else if (cookie && cookie.startsWith('token=')) {
      return cookie.substring(6);
    }
    return null;
  }

  private validateToken(token: string, request: any): boolean {
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (err) {
      // console.log('校验错误:', err);
      return false;
    }
  }
}
