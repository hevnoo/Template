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
  // @IsOptional()
  // id: string;

  @IsString()
  @IsNotEmpty({ message: 'title 不允许为空' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'content 最小长度为1' })
  @IsNotEmpty({ message: 'content 不允许为空' })
  content: string;

  @IsOptional()
  authorId: string;

  @IsOptional()
  category: string;

  @IsOptional()
  viewCount: string;

  @IsOptional()
  likeCount: string;
}
//更新
export class UpdateDto {
  @IsNotEmpty({ message: 'id 不允许为空' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'title 不允许为空' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'content 最小长度为1' })
  @IsNotEmpty({ message: 'content 不允许为空' })
  content: string;

  @IsOptional()
  authorId: string;

  @IsOptional()
  category: string;

  @IsOptional()
  viewCount: string;

  @IsOptional()
  likeCount: string;
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
