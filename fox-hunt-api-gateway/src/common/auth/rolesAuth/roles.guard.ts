import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenPayloadDto } from './interfaces/tokenPayload.interface';
import { ROLES_KEY } from './constants/constants';
import { Role } from './enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (requiredRoles.includes(Role.Any)) return true;
      const request = context.switchToHttp().getRequest();
      if (!request.headers.payload) {
        throw new UnauthorizedException('Token was not provided');
      }
      const tokenPayload: TokenPayloadDto = JSON.parse(request.headers.payload);

      const rolesIntersection: Role[] = tokenPayload.roles.filter((x) =>
        requiredRoles.includes(x),
      );
      request.tokenPayload = tokenPayload;
      if (rolesIntersection.length === 0) {
        throw new UnauthorizedException(
          'Provided role does not have access to this url',
        );
      }
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      throw new UnauthorizedException('Payload was not validated');
    }
    return true;
  }
}
