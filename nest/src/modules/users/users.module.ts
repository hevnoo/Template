import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from 'src/config/models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/constant';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [UsersService], //导出服务即被其他模块访问
  imports: [
    SequelizeModule.forFeature([Users]), //引入sql
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secretKey,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
})
export class UsersModule {}
