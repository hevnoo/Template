import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { RolesGuard } from './common/guard/roles.guard';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  //全局过滤器
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new AllExceptionsFilter());
  //全局守卫
  app.useGlobalGuards(new RolesGuard());
  //全局拦截器
  // app.useGlobalInterceptors(new LoggingInterceptor());
  // 全局类验证器
  app.useGlobalPipes(new ValidationPipe());
  //跨域
  app.enableCors();
  await app.listen(8282);
}
bootstrap();
