import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: () => void) {
    // const token = req.headers.authorization?.split(' ')[1];

    let token = '';
    const { cookie, authorization: authHeader } = req.headers;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // 去除 'Bearer ' 前缀，获取纯token
    } else if (cookie && cookie.startsWith('token=')) {
      token = cookie.substring(6);
    }
    // const token = req.headers.cookie?.substring(6);
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        // console.log('---payload---', payload, req);
        req.user = payload;
      } catch (error) {
        // 处理令牌无效的情况
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
    next();
  }
}

//通常将登录后的用户信息存储在请求对象的上下文中，以便在整个请求处理周期内访问和使用
