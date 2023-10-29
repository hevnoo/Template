//  /src/common/decorator/public.decorator.ts
// 不需要鉴权的路由里使用
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
