import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(() => {
  // const request = ctx.switchToHttp().getRequest();
  return { userId: '123' };
});
