import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './modules/users/users.controller';
import { TestModule } from './modules/test/test.module';
import { UsersModule } from './modules/users/users.module';
// 注册全局范围的过滤器直接为任何模块设置过滤器
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
//sql
import { Users } from './config/models/users.model';
import { Articles } from './config/models/articles.model';
import { Favorites } from './config/models/favorites.model';
//npm
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constant';
import { JwtAuthGuard } from './common/guard/auth.guard';
//全局过滤器
import { JwtAuthExceptionFilter } from './common/filter/auth-exceptions.filter';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { ArticlesController } from './modules/articles/articles.controller';
import { ArticlesService } from './modules/articles/articles.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { FavoritesController } from './modules/favorites/favorites.controller';
import { FavoritesService } from './modules/favorites/favorites.service';
import { FavoritesModule } from './modules/favorites/favorites.module';

//声明user，用来保存用户的信息username
declare module 'express' {
  export interface Request extends Express.Request {
    user: any; // 这里的`any`应该是用户信息的实际类型
  }
}

@Module({
  imports: [
    TestModule,
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'second_hand',
      autoLoadModels: true, // 自动加载模型
      synchronize: true, // 自动同步数据库
      models: [Users, Articles, Favorites], // 要开始使用`User`模型，我们需要通过将其插入到`forRoot()`方法选项的`models`数组中来让`Sequelize`知道它的存在。
    }),
    SequelizeModule.forFeature([Users, Articles, Favorites]), //在本模块中使用前需引入
    PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secretKey,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    ArticlesModule,
    FavoritesModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ArticlesController,
    FavoritesController,
  ],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AllExceptionsFilter, // 将 AllExceptionsFilter 添加到提供者列表中
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    ArticlesService,
    FavoritesService,
  ],
})
// export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('test');
//   }
// }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AuthMiddleware)
      //排除不需要认证的路由
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        'cats/(.*)',
      )
      // '*'表示所有路由
      .forRoutes('*');
    // .forRoutes({ path: '*', method: RequestMethod.GET });
    // .forRoutes({ path: 'api/test/getData', method: RequestMethod.GET });
  }
}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .exclude({ path: 'auth/login', method: RequestMethod.POST }) // 排除不需要认证的路由
//       .forRoutes('*');
//   }
// }
