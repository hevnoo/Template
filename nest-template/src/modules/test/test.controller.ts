import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Req,
  HttpCode,
  Header,
  Res,
  HttpException,
  HttpStatus,
  UseFilters,
  ForbiddenException,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TestService } from './test.service';
//过滤器
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { TestMiddleware } from './test.middleware';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { Users } from 'src/config/models/users.model';
//自定义的鉴权装饰器，未使用@Public()即需要鉴权
import { Public } from 'src/common/decorator/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';

// @UseFilters(new HttpExceptionFilter()) //模块全局过滤器捕获并抛出错误
// @UseInterceptors(LoggingInterceptor) //拦截器
@Controller('api/test')
export class TestController {
  constructor(private testService: TestService) {}

  //注册
  @Public()
  @Post('/register')
  @HttpCode(200)
  async register(@Body() key?: Users): Promise<object> {
    return this.testService.register(key);
  }

  //登录
  @Public()
  @Post('/login')
  @HttpCode(200)
  // @UsePipes(new ValidationPipe())
  async login(@Body() key?: LoginUserDto): Promise<object> {
    console.log('---login---', key);
    return this.testService.login(key);
  }

  //查询
  // @Public()
  @Get('/getData')
  // @UseGuards(JwtAuthGuard)
  //   @UseGuards(RolesGuard)
  @Header('Cache-Control', 'none')
  @HttpCode(200)
  // findAlls(@Req() request: Request) 所有参数
  findAll(@Query() key?: object): Promise<object> {
    console.log('---findAll参数---', key);
    return this.testService.findAll(key);
  }

  //新增
  @UseInterceptors(LoggingInterceptor) //拦截器
  @Post('/createData')
  @HttpCode(200)
  async create(@Body() key?: object): Promise<object> {
    console.log('---create参数---', key);
    // this.testService.create();
    return this.testService.create(key);
  }

  //更新
  // @Public()
  @Put('/updateData')
  @HttpCode(200)
  async update(@Body() key?: Users): Promise<object> {
    console.log('---update参数---', key);
    return this.testService.update(key);
  }

  //删除
  @Public()
  @Delete('deleteData')
  async delete(
    @Query('id') id?: number | string | number[] | string[],
  ): Promise<object> {
    console.log('---delete参数---', id);
    return this.testService.delete(id);
  }
  // @Delete(':id')
  // async delete(@Param('id') id: number): Promise<object> {
  //   return this.testService.delete(id);
  // }

  //------------------------------
  @Get('/error')
  @UseFilters(new HttpExceptionFilter()) //过滤器方式抛错
  async myErr() {
    throw new ForbiddenException();
    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a error message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );
  }

  // 使用 @Res() 装饰器--------------------
  @Get('/getData1')
  findAll1(@Res() res: Response) {
    res.status(HttpStatus.OK).json(['this is 1']);
  }
  @Post('createData1')
  create1(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send({ msg: 'this is 1' });
  }
}
