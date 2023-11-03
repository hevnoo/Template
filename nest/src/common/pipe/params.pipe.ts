import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 在这里根据不同的格式处理数据逻辑
    if (metadata.type === 'body') {
      // 处理请求体中的数据
      // ...
    } else if (metadata.type === 'query') {
      // 处理查询参数中的数据
      // ...
      console.log('value:', value);
    } else if (metadata.type === 'param') {
      // 处理路径参数中的数据
      // ...
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      // throw new BadRequestException('Invalid JSON string');
      throw new HttpException('Invalid JSON string', HttpStatus.UNAUTHORIZED);
    }
  }
}
