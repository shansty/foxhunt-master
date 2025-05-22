import { RolesGuard } from './roles.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let context: DeepMocked<ExecutionContext>;

  beforeEach(() => {
    reflector = new Reflector();
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['SYSTEM_ADMIN']);
    guard = new RolesGuard(reflector);
    context = createMock<ExecutionContext>();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true', () => {
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        payload:
          '{"email":"test@unittest.com","roles":["SYSTEM_ADMIN"],"organizationId":1}',
      },
    });
    expect(guard.canActivate(context)).toBeTruthy();
  });

  it('should return true', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(['ANY']);
    expect(guard.canActivate(context)).toBeTruthy();
  });

  it('should throw an UnauthorizedException if payload was not provided', () => {
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {},
    });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw an UnauthorizedException if user role is incorrect', () => {
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        payload:
          '{"email":"test@unittest.com","roles":["TEST"],"organizationId":1}',
      },
    });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw an UnauthorizedException if JSON is malformed', () => {
    context.switchToHttp().getRequest.mockReturnValue({
      headers: {
        payload:
          '"email":"test@unittest.com","roles":["SYSTEM_ADMIN"],"organizationId":1',
      },
    });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
