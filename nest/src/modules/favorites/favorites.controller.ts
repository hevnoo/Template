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
//自定义的鉴权装饰器，未使用@Public()即需要鉴权
import { Public } from 'src/common/decorator/public.decorator';
import { CreateDto, UpdateDto, DeleteDto } from './dto/index.dto';
import { FavoritesService } from './favorites.service';

@Controller('api/favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}
  //查询
  // @Public()
  @Get('/getData')
  @HttpCode(200)
  findAll(@Req() req: any, @Query() key?: object): Promise<object> {
    console.log('---findAll参数---', key);
    return this.favoritesService.findAll(req, key);
  }
  //新增
  // @Public()
  @Post('/create')
  @HttpCode(200)
  async create(@Req() req: any, @Body() key?: CreateDto): Promise<object> {
    console.log('---create参数---', key);
    return this.favoritesService.create(req, key);
  }
  //更新
  // @Public()
  @Put('/update')
  @HttpCode(200)
  async update(@Req() req: any, @Body() key?: UpdateDto): Promise<object> {
    console.log('---update参数---', key);
    return this.favoritesService.update(req, key);
  }

  //删除
  // @Public()
  @Delete('/delete')
  @HttpCode(200)
  //用注解的方式可以直接装换类型 @Query('id') key?: number[]
  async delete(@Body() key?: any): Promise<object> {
    console.log('---delete参数---', key);
    return this.favoritesService.delete(key);
  }
}
