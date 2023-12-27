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
import { UsersService } from './users.service';
//过滤器
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { Users } from 'src/config/models/users.model';
//自定义的鉴权装饰器，未使用@Public()即需要鉴权
import { Public } from 'src/common/decorator/public.decorator';
import {
  LoginUserDto,
  RegisterUserDto,
  UpdateUserDto,
  DeleteUserDto,
} from './dto/users.dto';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
//参数转换
import { ParamsPipe } from 'src/common/pipe/params.pipe';

// @UseFilters(new HttpExceptionFilter()) //模块全局过滤器捕获并抛出错误
// @UseInterceptors(LoggingInterceptor) //拦截器
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //菜单
  @Get('/getMenu')
  @HttpCode(200)
  async getMenu(@Req() req: any, @Query() key?: string): Promise<object> {
    return this.usersService.getMenu(req, key);
  }

  //注册
  @Public()
  @Post('/register')
  @HttpCode(200)
  async register(@Body() key?: RegisterUserDto): Promise<object> {
    return this.usersService.register(key);
  }

  //登录
  @Public()
  @Post('/login')
  @HttpCode(200)
  // @UsePipes(new ValidationPipe())
  async login(@Body() key?: LoginUserDto): Promise<object> {
    console.log('---login---', key);
    return this.usersService.login(key);
  }

  //查询
  // @Public()
  @Get('/getData')
  //   @Header('Cache-Control', 'none')
  @HttpCode(200)
  // findAlls(@Req() request: Request) 所有参数
  findAll(@Query() key?: object): Promise<object> {
    console.log('---findAll参数---', key);
    return this.usersService.findAll(key);
  }

  //新增
  // @UseInterceptors(LoggingInterceptor) //拦截器
  @Post('/createData')
  @HttpCode(200)
  async create(@Body() key?: object): Promise<object> {
    console.log('---create参数---', key);
    // this.testService.create();
    return this.usersService.create(key);
  }

  //更新
  // @Public()
  @Put('/updateData')
  @HttpCode(200)
  async update(@Req() req: any, @Body() key?: UpdateUserDto): Promise<object> {
    console.log('---update参数---', key);
    return this.usersService.update(req, key);
  }

  //删除
  //   @Public()
  //   @UsePipes(new ParamsPipe())
  @Delete('/deleteData')
  @HttpCode(200)
  //用注解的方式可以直接装换类型 @Query('id') key?: number[]
  async delete(@Body() key?: any): Promise<object> {
    console.log('---delete参数---', key);
    return this.usersService.delete(key);
  }
}
