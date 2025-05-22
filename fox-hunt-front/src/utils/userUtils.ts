import { Role, User } from 'src/types/User';
import { RolesEnum, RoleOperators, PrioritizedRoles } from './types/roleTypes';

export const getUserRoles = (user: User): RolesEnum[] =>
  user && user.roles ? user.roles.map((roleObj: Role) => roleObj.role) : [];

export const getTopPriorityUserRole = (user: User): RolesEnum => {
  const roles: RolesEnum[] = getUserRoles(user);
  if (roles.includes(RolesEnum.SYSTEM_ADMIN)) return RolesEnum.SYSTEM_ADMIN;
  if (roles.includes(RolesEnum.ADMIN)) return RolesEnum.ADMIN;
  if (roles.includes(RolesEnum.COACH)) return RolesEnum.COACH;
  return RolesEnum.PARTICIPANT;
};

export const isRoleHasUpperPriority = (
  firstRole: RolesEnum,
  secondRole: RolesEnum,
): boolean =>
  PrioritizedRoles.indexOf(firstRole) > PrioritizedRoles.indexOf(secondRole);

export const userManageMultipleOrganizations = (
  user: User,
): boolean | undefined => {
  return user ? user?.manageMultipleOrganizations : false;
};

export const userHasRoles = (
  user: any,
  rolesArray: RolesEnum[],
  roleOperator: RoleOperators = RoleOperators.OR,
): Boolean => {
  const userRoles = getUserRoles(user);

  const hasRoles = rolesArray.filter((role: RolesEnum) =>
    userRoles.includes(role),
  );

  switch (roleOperator) {
    case RoleOperators.OR:
      return hasRoles.length > 0;
    case RoleOperators.AND:
      return hasRoles.length === rolesArray.length;
    case RoleOperators.ONLY:
      return hasRoles.length > 0 && hasRoles.length === userRoles.length;
  }
};
