import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLES_KEY } from './constants/constants';
import { Role } from './enums/role.enum';
import { RolesGuard } from './roles.guard';

export const Roles = (...roles: Role[]) => {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    SetMetadata(ROLES_KEY, roles),
    UseGuards(RolesGuard),
  );
};
