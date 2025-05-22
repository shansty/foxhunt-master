import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
} from '@mui/material';

import { DropdownMenu, TableHeader } from 'common-front';
import * as allUsersActions from '../../store/actions/allUsersActions';
import { selectAllUsers } from '../../store/selectors/allUsersSelectors';
import {
  selectEmptyRows,
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';
import CustomTablePagination from '../../component/pagination/CustomTablePagination';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import { User } from '../../types/AllUsers';

const optimalRecordHeight = 63;

export default function UserListPage() {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const pageSize = useSelector(selectPageSize);
  const pageNumber = useSelector(selectPageNumber);
  const emptyRows = useSelector(selectEmptyRows);

  useEffect(() => {
    dispatch(allUsersActions.fetchAllUsers());
  }, []);

  function getBadgeColor(isActive: boolean) {
    return clsx('m-1 badge', {
      'badge-success': isActive,
      'badge-danger': !isActive,
    });
  }

  function getDropdownItems(user: User) {
    const { banned, id } = user;
    const items = [];
    const ban = {
      id: 1,
      title: 'Ban',
      action: () => dispatch(allUsersActions.setUserBan(id)),
    };
    const unBan = {
      id: 2,
      title: 'Un-ban',
      action: () => dispatch(allUsersActions.setUserBan(id)),
    };

    if (banned) {
      items.push(unBan);
    } else {
      items.push(ban);
    }
    return items;
  }

  return (
    <>
      <PageTitle
        titleHeading="All users"
        titleDescription="Table showing all existing users."
      />
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHeader
            headerCells={[
              { name: 'User' },
              { name: 'User name' },
              { name: 'Status' },
              { name: 'Actions' },
            ]}
          />
          <TableBody>
            {(pageSize > 0
              ? allUsers.slice(
                  pageNumber * pageSize,
                  pageNumber * pageSize + pageSize,
                )
              : allUsers
            ).map((user: User) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell>{`${user.firstName || ''} ${
                  user.lastName || ''
                }`}</TableCell>
                <TableCell>
                  <span className={getBadgeColor(!user.banned)}>
                    {user.banned ? 'BANNED' : 'ACTIVE'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu items={getDropdownItems(user)} />
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: optimalRecordHeight * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <CustomTablePagination items={allUsers} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
