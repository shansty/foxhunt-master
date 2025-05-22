import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Payload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PayloadEntrails => {
    const request = ctx.switchToHttp().getRequest();
    return JSON.parse(request.headers.payload || request.headers.payload[0]);
  },
);

export interface PayloadEntrails {
  email: string;
  organizationId?: number;
  roles: string[];
}
