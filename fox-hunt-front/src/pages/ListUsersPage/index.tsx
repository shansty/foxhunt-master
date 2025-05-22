import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button } from '@mui/material';
import ListUsers from 'src/containers/ListUsersContainer/ListUsers';
import { PageTitle } from 'common-front';
import InviteUserContainer from 'src/containers/InviteUserContainer';
import { getUsers } from 'src/store/actions/usersActions';
import {
  selectAllUsers,
  selectAllUsersCount,
} from 'src/store/selectors/usersSelectors';
import {
  selectCurrentOrganization,
  selectLoggedUserRoles,
} from 'src/store/selectors/authSelectors';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';
import { User } from 'src/types/User';
import { AppDispatch } from 'src/store';
import { CurrentOrganization } from 'src/types/Organization';

interface Page {
  page: number;
  size: number;
}

export interface ListUsersProps {
  users: User[];
  userRoles: string[];
  allSize: number;
  fetchUsers: (data: Page) => void;
  organization: CurrentOrganization;
}

export interface Pager {
  page: number;
  rowsPerPage: number;
}

function ListUsersPage({
  users,
  userRoles,
  allSize,
  fetchUsers,
  organization,
}: ListUsersProps) {
  const initialPager: Pager = {
    page: 0,
    rowsPerPage: 10,
  };

  const [pager, setPager] = useState<Pager>(initialPager);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpenPopUp(true);
  };

  const handleClickClose = () => {
    setOpenPopUp(false);
  };

  useEffect(() => {
    fetchUsers({
      page: pager.page,
      size: pager.rowsPerPage,
    });
  }, [fetchUsers, pager.page, pager.rowsPerPage, organization]);

  const changePager = (pagerNext = { page: 0, rowsPerPage: 25 }) => {
    setPager(Object.assign(pager, pagerNext));
    fetchUsers({
      page: pager.page,
      size: pager.rowsPerPage,
    });
  };

  return (
    <MainLayout>
      <PageTitle
        titleHeading={'User management'}
        titleDescription={
          'Table represents all the members of current organization'
        }
      ></PageTitle>
      <Button
        variant={'contained'}
        color={'primary'}
        onClick={handleClickOpen}
        className={'mb-3'}
      >
        Invite a user
      </Button>
      {users && (
        <ListUsers
          users={users}
          pager={pager}
          onPageChange={changePager}
          countAllRows={allSize}
        />
      )}
      {openPopUp && (
        <InviteUserContainer
          userRoles={userRoles}
          pager={pager}
          isOpen={openPopUp}
          handleClickClose={handleClickClose}
        />
      )}
    </MainLayout>
  );
}

const mapStateToProps = createStructuredSelector({
  users: selectAllUsers,
  userRoles: selectLoggedUserRoles,
  allSize: selectAllUsersCount,
  organization: selectCurrentOrganization,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchUsers: (params: Page) => dispatch(getUsers(params)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(signInRequired(ListUsersPage));
