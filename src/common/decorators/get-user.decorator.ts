import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

type AuthUser = { userId: string; email: string } & Record<string, unknown>;

interface RequestWithUser extends Request {
  user?: AuthUser;
}

export const GetUser = createParamDecorator<unknown>(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      return undefined;
    }
    if (data) {
      return (user as Record<string, unknown>)[data];
    }
    return user;
  },
);
