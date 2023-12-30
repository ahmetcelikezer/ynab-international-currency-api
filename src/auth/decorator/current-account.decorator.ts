import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedAccountPayload } from '@src/auth/payload/authenticated-account.payload';

export const GetCurrentAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAccountPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
