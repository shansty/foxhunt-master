import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TableHeader } from 'common-front';
import { Paper, Table, TableBody, TableContainer } from '@mui/material';
import TableFooterComponent from 'src/components/TableFooter';
import UserTableRow from './UserTableRow';
import UserActivationDialog from './UserActivationDialog/UserActivationDialog';
import {
  setUserDeactivation,
  getUserById,
  setUserActivation,
} from 'src/store/actions/usersActions';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { sortUsersRolesByRights } from 'src/utils/formatUtil';
import {
  buildUpdateBuIdProfileUrl,
  buildProfileUrl,
} from 'src/api/utils/navigationUtil';
import { userHasRoles, getUserRoles } from 'src/utils/userUtils';
import { RolesEnum } from 'src/utils/types/roleTypes';
import { useNavigate } from 'react-router-dom';
import { User } from 'src/types/User';
import { Pager } from 'src/pages/ListUsersPage';
import { useAppDispatch } from 'src/store/hooks';

const checkEditingAccess = (userToManage: User, loggedUser: User) => {
  if (
    userHasRoles(loggedUser, [RolesEnum.COACH]) &&
    !userHasRoles(userToManage, [RolesEnum.ADMIN])
  ) {
    return true;
  }
  if (loggedUser?.id === userToManage?.id) {
    return true;
  }
};

const checkActivationAccess = (userToManage: User, loggedUser: User) => {
  if (!userToManage.activatedSince) {
    return false;
  }
  if (
    userHasRoles(loggedUser, [RolesEnum.ADMIN]) &&
    !userHasRoles(userToManage, [RolesEnum.ADMIN])
  ) {
    return true;
  }
  if (
    userHasRoles(loggedUser, [RolesEnum.COACH]) &&
    userHasRoles(userToManage, [RolesEnum.PARTICIPANT]) &&
    getUserRoles(userToManage).length === 1
  ) {
    return true;
  }
  if (userToManage?.id === loggedUser?.id) {
    return true;
  }
};

export interface ListUsersProps {
  users: User[];
  pager: Pager;
  onPageChange: (pager: Pager) => void;
  countAllRows: number;
}

function ListUsers({
  countAllRows,
  onPageChange,
  pager,
  users,
}: ListUsersProps) {
  const [isActivationDialogOpen, setActivationDialogOpen] =
    useState<boolean>(false);
  const [userToManage, setUserToManage] = useState<User>(users[0]);
  const [roles, setRoles] = useState<RolesEnum[]>([]);

  const loggedUser = useSelector(selectLoggedUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    userToManage?.roles && setRoles(userToManage.roles.map(({ role }) => role));
  }, [userToManage]);

  const goToUserProfile = (id: number) => {
    dispatch(getUserById(id)).then(({ payload }: any) => {
      if (payload?.status === 200) {
        navigate(buildUpdateBuIdProfileUrl(id));
      }
    });
  };

  const getMenuActions = (user: User) => {
    const actions = [];
    const details =
      loggedUser.id === user.id
        ? {
            id: user.id,
            title: 'Details',
            to: buildProfileUrl(),
          }
        : {
            id: user.id,
            title: 'Details',
            action: () => goToUserProfile(user.id ? +user.id : -1),
          };

    const activation = {
      id: user.id,
      title: user.activated ? 'Deactivate' : 'Activate',
      to: '#',
      action: () => {
        openAlertDialog(user);
      },
    };

    checkActivationAccess(user, loggedUser) && actions.push(activation);
    checkEditingAccess(user, loggedUser) && actions.push(details);
    return actions;
  };

  const openAlertDialog = (user: User) => {
    setUserToManage(user);
    setActivationDialogOpen(true);
  };

  const closeAlertDialog = () => {
    setActivationDialogOpen(false);
  };

  const submitUserActivation = () => {
    const isCurrentUserGettingDeactivated = userToManage.id === loggedUser.id;
    userToManage.activated
      ? dispatch(
          setUserDeactivation({
            userToManage,
            isCurrentUserGettingDeactivated,
          }),
        )
      : dispatch(
          setUserActivation({
            userToManage,
            roles,
          }),
        );
    closeAlertDialog();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHeader
          headerCells={[
            { name: 'Email' },
            { name: 'User name' },
            { name: 'Title' },
            { name: 'Joined' },
            { name: 'Status' },
            { name: 'Actions' },
          ]}
        />
        <TableBody>
          {sortUsersRolesByRights(users).map((user: User) => (
            <UserTableRow
              key={user.id}
              user={user}
              menuActions={getMenuActions(user)}
            />
          ))}
        </TableBody>
        <TableFooterComponent
          pager={pager}
          onChange={onPageChange}
          countAllRows={countAllRows}
        />
      </Table>
      {isActivationDialogOpen && (
        <UserActivationDialog
          user={userToManage}
          onClose={closeAlertDialog}
          onSubmit={submitUserActivation}
          userRoles={roles}
          setRoles={setRoles}
        />
      )}
    </TableContainer>
  );
}

export default ListUsers;
