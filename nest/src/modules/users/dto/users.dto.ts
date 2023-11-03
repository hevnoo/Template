import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';

// 参数校验
export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'username 不允许为空' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'password 最小长度为4' })
  @IsNotEmpty({ message: 'password 不允许为空' })
  password: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional() //可以为null或undefined
  @IsEmail({}, { message: 'email 格式不正确' })
  email: string;
}

// 参数校验
export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'username 不允许为空' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'password 最小长度为4' })
  @IsNotEmpty({ message: 'password 不允许为空' })
  password: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional() //可以为null或undefined
  @IsEmail({}, { message: 'email 格式不正确' })
  email: string;
}

export class UpdateUserDto {
  @IsNotEmpty({ message: 'id 不允许为空' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'username 不允许为空' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'password 最小长度为4' })
  @IsNotEmpty({ message: 'password 不允许为空' })
  password: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional() //可以为null或undefined
  @IsEmail({}, { message: 'email 格式不正确' })
  email: string;
}

export class DeleteUserDto {
  // @IsString({ message: 'id 必须为字符串类型' })
  // @IsArray({ message: 'id 必须为数组类型' })
  // @IsNumber({ message: 'id 必须为数字类型' })
  @IsNotEmpty({ message: 'id 不允许为空' })
  id: string | string[] | number | number[];

  @IsOptional()
  username: string;
}
