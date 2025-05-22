export enum RolesEnum {
  PARTICIPANT = 'PARTICIPANT',
  COACH = 'TRAINER',
  ADMIN = 'ORGANIZATION_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

export const PrioritizedRoles = [
  RolesEnum.PARTICIPANT,
  RolesEnum.COACH,
  RolesEnum.ADMIN,
  RolesEnum.SYSTEM_ADMIN,
];

export enum RoleOperators {
  OR = 'OR',
  AND = 'AND',
  ONLY = 'ONLY',
}

export const ROLES_BY_RIGHTS_LEVEL = [
  RolesEnum.ADMIN,
  RolesEnum.COACH,
  RolesEnum.PARTICIPANT,
];
