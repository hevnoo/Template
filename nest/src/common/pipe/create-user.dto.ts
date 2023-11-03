import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

//参数校验
export class CreateUserDto {
  @IsNotEmpty({ message: 'username 不允许为空' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'password 不允许为空' })
  @IsString()
  @IsString()
  @MinLength(8)
  password: string;

  @IsEmail()
  nickname: string;

  @IsEmail()
  role: string;

  @IsEmail()
  email: string;
}
