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
import { ArticlesService } from './articles.service';
//过滤器
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { Articles } from 'src/config/models/articles.model';
//自定义的鉴权装饰器，未使用@Public()即需要鉴权
import { Public } from 'src/common/decorator/public.decorator';
import { CreateDto, UpdateDto, DeleteDto } from './dto/index.dto';

@Controller('api/articles')
export class ArticlesController {
  constructor(private articleService: ArticlesService) {}

  //查询
  // @Public()
  @Get('/getData')
  @HttpCode(200)
  findAll(@Req() req: any, @Query() key?: object): Promise<object> {
    console.log('---findAll参数---', key);
    return this.articleService.findAll(req, key);
  }
  //新增
  // @Public()
  @Post('/create')
  @HttpCode(200)
  async create(@Req() req: any, @Body() key?: CreateDto): Promise<object> {
    console.log('---create参数---', key);
    return this.articleService.create(req, key);
  }
  //更新
  // @Public()
  @Put('/update')
  @HttpCode(200)
  async update(@Req() req: any, @Body() key?: UpdateDto): Promise<object> {
    console.log('---update参数---', key);
    return this.articleService.update(req, key);
  }

  //删除
  // @Public()
  @Delete('/delete')
  @HttpCode(200)
  //用注解的方式可以直接装换类型 @Query('id') key?: number[]
  async delete(@Body() key?: any): Promise<object> {
    console.log('---delete参数---', key);
    return this.articleService.delete(key);
  }
}
