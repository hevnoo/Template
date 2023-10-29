import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

// 参数校验
export class LoginUserDto {
  @IsNotEmpty({ message: 'username 不允许为空' })
  @IsString()
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
