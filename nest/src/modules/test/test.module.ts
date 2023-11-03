import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Request, Response } from 'express';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TestMiddleware } from './test.middleware';
import { Users } from 'src/config/models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/constant';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

@Module({
  controllers: [TestController],
  providers: [
    TestService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [TestService], //导出服务即被其他模块访问
  imports: [
    SequelizeModule.forFeature([Users]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secretKey,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ], // 确保service用@InjectRepository()装饰器将 UsersRepository 注入到 UsersService 中:
})
// export class TestModule {}
export class TestModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}
