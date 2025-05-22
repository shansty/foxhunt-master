import {
  userHasRoles,
  getUserRoles,
  userManageMultipleOrganizations,
} from '../userUtils';
import {
  RolesEnum,
  RoleOperators,
  ROLES_BY_RIGHTS_LEVEL,
} from '../types/roleTypes';
import { User } from 'src/types/User';

describe('Test roleCheckUtils function', () => {
  const user: User = {
    id: 1,
    activated: true,
    email: 'test@gmail.com',
    firstName: 'Pavel',
    lastName: 'Pavlov',
    roles: [
      { organizationId: 1, userId: 1, role: RolesEnum.ADMIN },
      { organizationId: 2, userId: 1, role: RolesEnum.COACH },
      { organizationId: 1, userId: 1, role: RolesEnum.PARTICIPANT },
    ],
  };

  const userOnlyParticipant: User = {
    id: 2,
    activated: true,
    email: 'test@gmail.com',
    firstName: 'Ivan',
    lastName: 'Ivanov',
    roles: [{ organizationId: 1, userId: 1, role: RolesEnum.PARTICIPANT }],
  };

  test('Return true if user has any of the mentioned roles without sending operator (Default behavior)', () => {
    const roles: RolesEnum[] = [RolesEnum.COACH];

    const hasRoles: Boolean = userHasRoles(user, roles);

    expect(hasRoles).toBe(true);
  });
  test('Return true if user has any of the mentioned roles', () => {
    const roles: RolesEnum[] = [RolesEnum.COACH];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.OR);

    expect(hasRoles).toBe(true);
  });
  test('Return false if user has not any of the mentioned roles', () => {
    const roles = ['TEST'];

    const hasRoles: Boolean = userHasRoles(
      user,
      roles as any,
      RoleOperators.OR,
    );

    expect(hasRoles).toBe(false);
  });
  test('Return true if user has all the of mentioned roles', () => {
    const roles: RolesEnum[] = [RolesEnum.COACH, RolesEnum.ADMIN];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.AND);

    expect(hasRoles).toBe(true);
  });
  test('Return false if user has not all of the mentioned roles', () => {
    const roles = [RolesEnum.COACH, RolesEnum.ADMIN, 'TEST'];

    const hasRoles: Boolean = userHasRoles(
      user,
      roles as any,
      RoleOperators.AND,
    );

    expect(hasRoles).toBe(false);
  });
  test('Return true if user has only the mentioned roles', () => {
    const roles: RolesEnum[] = [RolesEnum.PARTICIPANT];

    const hasRoles: Boolean = userHasRoles(
      userOnlyParticipant,
      roles,
      RoleOperators.ONLY,
    );

    expect(hasRoles).toBe(true);
  });
  test('Return false if user has not the same roles of the mentioned roles', () => {
    const roles: RolesEnum[] = [RolesEnum.PARTICIPANT];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.ONLY);

    expect(hasRoles).toBe(false);
  });
  test('Return false if user is undefined using RoleOperators.AND operator ', () => {
    const user = undefined;
    const roles: RolesEnum[] = [RolesEnum.COACH, RolesEnum.ADMIN];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.AND);

    expect(hasRoles).toBe(false);
  });
  test('Return false if user is undefined using RoleOperators.ONLY operator ', () => {
    const user = undefined;
    const roles: RolesEnum[] = [RolesEnum.PARTICIPANT];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.ONLY);

    expect(hasRoles).toBe(false);
  });
  test('Return false if user is null ', () => {
    const user = null;
    const roles: RolesEnum[] = [RolesEnum.COACH, RolesEnum.ADMIN];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.AND);

    expect(hasRoles).toBe(false);
  });
  test('Return false if user is an empty object ', () => {
    const user = {};
    const roles: RolesEnum[] = [RolesEnum.COACH, RolesEnum.ADMIN];

    const hasRoles: Boolean = userHasRoles(user, roles, RoleOperators.AND);

    expect(hasRoles).toBe(false);
  });
});

describe('Test getUserRoles function', () => {
  test('Test getUserRoles with correct user', () => {
    const user: User = {
      id: 1,
      activated: true,
      email: 'test@gmail.com',
      firstName: 'Pavel',
      lastName: 'Pavlov',
      roles: [
        { organizationId: 1, userId: 1, role: RolesEnum.ADMIN },
        { organizationId: 2, userId: 1, role: RolesEnum.COACH },
        { organizationId: 1, userId: 1, role: RolesEnum.PARTICIPANT },
      ],
    };
    expect(getUserRoles(user)).toStrictEqual(ROLES_BY_RIGHTS_LEVEL);
  });
  test('Return [] if user is undefined', () => {
    expect(getUserRoles(undefined as any)).toEqual([]);
  });
  test('Return [] if user is an empty object', () => {
    expect(getUserRoles({} as any)).toStrictEqual([]);
  });
  test('Return [] if user is null', () => {
    expect(getUserRoles(null as any)).toStrictEqual([]);
  });
});

describe('Test userManageMultipleOrganizations function', () => {
  test('Test userManageMultipleOrganizations with correct user', () => {
    const user: User = {
      id: 1,
      activated: true,
      email: 'test@gmail.com',
      firstName: 'Pavel',
      lastName: 'Pavlov',
      roles: [
        { organizationId: 1, userId: 1, role: RolesEnum.ADMIN },
        { organizationId: 2, userId: 1, role: RolesEnum.COACH },
        { organizationId: 1, userId: 1, role: RolesEnum.PARTICIPANT },
      ],
      manageMultipleOrganizations: true,
    };
    expect(userManageMultipleOrganizations(user)).toStrictEqual(true);
  });
  test('Return false if user is undefined', () => {
    expect(userManageMultipleOrganizations(undefined as any)).toEqual(false);
  });
  test('Return [] if user is an empty object', () => {
    expect(getUserRoles({} as any)).toStrictEqual([]);
  });
  test('Return [] if user is null', () => {
    expect(getUserRoles(null as any)).toStrictEqual([]);
  });
  test('Return false if user manages 1 or less organizations', () => {
    const user: User = {
      id: 1,
      activated: true,
      email: 'test@gmail.com',
      firstName: 'Pavel',
      lastName: 'Pavlov',
      roles: [],
      manageMultipleOrganizations: false,
    };
    expect(userManageMultipleOrganizations(user)).toStrictEqual(false);
  });
});
