import React from 'react';
import clsx from 'clsx';
import { TableCell, TableRow } from '@mui/material';
import { DropdownMenu } from 'common-front';
import {
  enumStringToReadableFormat,
  formatToLocalDate,
} from 'src/utils/formatUtil';
import { User, Role } from 'src/types/User';

export function getBadgeColor(status: boolean) {
  return clsx('m-1 badge', {
    'badge-success': status,
    'badge-danger': !status,
  });
}

export function getRoles(roles: Role[]) {
  if (roles.length !== 0) {
    return roles.reduce(
      (allRoles, role, index) =>
        index > 0
          ? `${allRoles}, ${enumStringToReadableFormat(role.role)}`
          : allRoles,
      enumStringToReadableFormat(roles[0].role),
    );
  }
}

export function getBadgeStatus(user: User): string {
  if (!user.activatedSince) return 'Not joined';
  if (user.activated) return 'Active';
  return 'Inactive';
}

const UserTableRow = ({
  menuActions,
  user,
}: {
  user: User;
  menuActions: any[];
}) => (
  <TableRow>
    <TableCell scope="row" align="justify">
      {user.email}
    </TableCell>
    <TableCell scope="row" align="justify">
      {!!user.firstName || !!user.lastName
        ? `${user.firstName} ${user.lastName}`
        : '-'}
    </TableCell>
    <TableCell scope="row" align="justify">
      {getRoles(user.roles ? user.roles : [])}
    </TableCell>
    <TableCell align="justify">
      {user.activatedSince ? formatToLocalDate(user.activatedSince) : '-'}
    </TableCell>
    <TableCell align="justify">
      <span className={getBadgeColor(!!user.activated)}>
        {getBadgeStatus(user)}
      </span>
    </TableCell>
    <TableCell align="justify">
      {menuActions.length > 0 && <DropdownMenu items={menuActions} />}
    </TableCell>
  </TableRow>
);

export default UserTableRow;
