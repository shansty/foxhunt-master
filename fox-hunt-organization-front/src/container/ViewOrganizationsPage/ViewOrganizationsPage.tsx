import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Tooltip,
} from '@mui/material';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import * as organizationActions from '../../store/actions/organizationActions';
import clsx from 'clsx';
import { selectAllOrganizations } from '../../store/selectors/orgnizationSelectors';
import { createStructuredSelector } from 'reselect';
import * as RoutingUtil from '../../utils/RoutingUtil';
import {
  selectEmptyRows,
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';
import CustomTablePagination from '../../component/pagination/CustomTablePagination';

import { organizationStatusEnum } from '../../utils/enums';
import { DEFAULT_ORGANIZATION } from '../../utils/commonConstants';
import ChangeRootUserPopup from '../ChangeRootUserPopup';
import { OrganizationDispatch } from '../../types/Dispatch';
import { Organization } from '../../types/Organization';
import { DropdownMenu, TableHeader, useIsMobile } from 'common-front';

const optimalRecordHeight = 63;

function ViewOrganizationsPage(props: any) {
  const { organizations, pageSize, pageNumber, emptyRows } = props;
  const [organization, setOrganization] = useState(DEFAULT_ORGANIZATION);

  const isMobile = useIsMobile();

  const [openedRootUserPopup, setOpenedRootUserPopup] = useState(false);

  useEffect(() => {
    props.fetchOrganizations();
    return () => props.initPagination();
  }, []);

  function getBadgeColor(status: string) {
    return clsx('m-1 badge', {
      'badge-success': status === organizationStatusEnum.ACTIVE,
      'badge-primary': status === organizationStatusEnum.NEW,
      'badge-danger': status === organizationStatusEnum.DECLINED,
      'badge-warning': status === organizationStatusEnum.ONBOARDING,
      'badge-dark': status === organizationStatusEnum.DEACTIVATED,
    });
  }

  function getActivationActionTitle(status: string) {
    return status === organizationStatusEnum.DEACTIVATED
      ? 'Activate'
      : 'Deactivate';
  }

  function changeOrganizationStatus(organization: Organization) {
    const status: string =
      organization.status === organizationStatusEnum.DEACTIVATED
        ? organizationStatusEnum.ACTIVE
        : organizationStatusEnum.DEACTIVATED;
    props.changeOrganizationStatus(organization.id, status);
  }

  function toggleChangeRootUserPopup() {
    setOpenedRootUserPopup((prevState) => !prevState);
  }

  function showPopup(organization: Organization) {
    setOrganization(organization);
    toggleChangeRootUserPopup();
  }

  function buildActionMenu(organization: Organization) {
    const items = [];
    items.push({
      id: 1,
      title: 'Edit',
      to: RoutingUtil.buildLinkToEditOrganizationPage(organization.id),
    });
    !organization.system &&
      items.push({
        id: 2,
        title: getActivationActionTitle(organization.status),
        action: changeOrganizationStatus.bind(null, organization),
      });
    !organization.system &&
      items.push({
        id: 3,
        title: 'Change admin',
        action: () => showPopup(organization),
      });

    return items;
  }

  return (
    <>
      <PageTitle
        titleHeading="Organizations"
        titleDescription="Table showing all existing organizations."
      />
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHeader
            headerCells={[
              { name: 'Name' },
              { name: 'Type' },
              { name: 'Created', hideOnMobile: true },
              { name: 'Status' },
              { name: 'Status changed', hideOnMobile: true },
              { name: 'Action' },
            ]}
          />
          <TableBody>
            {(pageSize > 0
              ? organizations.slice(
                  pageNumber * pageSize,
                  pageNumber * pageSize + pageSize,
                )
              : organizations
            ).map((organization: Organization) => (
              <TableRow key={organization.id}>
                <TableCell component="th" scope="row">
                  {organization.name}
                  <Tooltip title={'Approximate number of members'}>
                    <span className={'m-1 badge badge-primary'}>
                      {organization.approximateEmployeesAmount}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell component="th" scope="row">
                  {organization.type}
                </TableCell>
                <TableCell hidden={isMobile}>
                  {new Date(organization.created).toLocaleDateString()}
                </TableCell>
                <TableCell style={{ width: '10%' }}>
                  <span className={getBadgeColor(organization.status)}>
                    {organization.status}
                  </span>
                </TableCell>
                <TableCell hidden={isMobile}>
                  {new Date(organization.lastStatusChange).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu items={buildActionMenu(organization)} />
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
              <CustomTablePagination items={organizations} />
            </TableRow>
          </TableFooter>
        </Table>
        {openedRootUserPopup && (
          <ChangeRootUserPopup
            organization={organization}
            onClose={toggleChangeRootUserPopup}
          />
        )}
      </TableContainer>
    </>
  );
}

ViewOrganizationsPage.defaultProps = {
  organizations: [],
};

const mapDispatchToProps = (dispatch: OrganizationDispatch) => ({
  fetchOrganizations: () => dispatch(organizationActions.fetchOrganizations()),
  initPagination: () => dispatch({ type: 'INIT_PAGINATION' }),
  changeOrganizationStatus: (id: number, status: string) =>
    dispatch(organizationActions.changeOrganizationStatus(id, status)),
});

const mapStateToProps = createStructuredSelector({
  organizations: selectAllOrganizations,
  pageSize: selectPageSize,
  pageNumber: selectPageNumber,
  emptyRows: selectEmptyRows,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewOrganizationsPage);
