import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

// 新增参数校验
export class CreateDto {
  @IsOptional()
  userId: string;

  @IsNotEmpty({ message: 'articleId 不允许为空' })
  articleId: string;

  @IsOptional()
  collectTime: string;
}
//更新
export class UpdateDto {
  @IsNotEmpty({ message: 'id 不允许为空' })
  id: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  articleId: string;

  @IsOptional()
  collectTime: string;
}
//删除
export class DeleteDto {
  // @IsString({ message: 'id 必须为字符串类型' })
  // @IsArray({ message: 'id 必须为数组类型' })
  // @IsNumber({ message: 'id 必须为数字类型' })
  @IsNotEmpty({ message: 'id 不允许为空' })
  // id: string | string[] | number | number[];
  id: number | number[];

  @IsOptional()
  username: string;
}
