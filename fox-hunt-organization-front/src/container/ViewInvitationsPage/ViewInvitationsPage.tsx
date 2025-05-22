import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import clsx from 'clsx';
import dayjs from 'dayjs';
import {
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  TextField,
  useMediaQuery,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import * as userInvitationActions from '../../store/actions/userInvitationActions';
import {
  selectUserInvitations,
  selectUserInvitationsLoadingState,
} from '../../store/selectors/userInvitationSelectors';
import {
  selectEmptyRows,
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';
import * as RoutingUtil from '../../utils/RoutingUtil';
import CustomTablePagination from '../../component/pagination/CustomTablePagination';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import { userInvitationStatusEnum } from '../../utils/enums';
import { selectError } from '../../store/selectors/authSelector';
import { USER_INVITATION_LOCAL_DATE_FORMAT } from '../../utils/commonConstants';
import { UserInvitationDispatch } from '../../types/Dispatch';
import { DropdownMenu, TableHeader, useIsMobile } from 'common-front';
import { formatInvitationDate } from '../../utils/formatUtil';

const optimalRecordHeight = 63;

const useStyles = makeStyles((theme) => ({
  column: {
    width: '30%',
  },
  formControl: {
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(5),
    minWidth: '120px',
  },
  minFormControl: {
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(5),
    width: '120px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  filterLabel: {
    marginRight: theme.spacing(2),
    fontSize: theme.spacing(2.5),
  },
}));

function ViewInvitationsPage({ userInvitations = [], ...props }: any) {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:475px)');
  const isMobile = useIsMobile();
  const { NEW, ACCEPTED, DECLINED, EXPIRED, FAILED } = userInvitationStatusEnum;

  const { pageSize, pageNumber, emptyRows } = props;

  const [status, setStatus] = React.useState('');

  const [organization, setOrganization] = React.useState('');

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(String(event.target.value));
  };

  const handleOrganizationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganization(event.target.value);
  };

  useEffect(() => {
    props.fetchUserInvitations();
    return () => props.initPagination();
  }, []);

  function getBadgeColor(status: string) {
    return clsx('m-1 badge', {
      'badge-success': status === ACCEPTED,
      'badge-primary': status === NEW,
      'badge-warning': status === DECLINED,
      'badge-dark': status === EXPIRED,
      'badge-danger': status === FAILED,
    });
  }

  function handleResendUserInvitation(id: number) {
    props.resendUserInvitation(id);
  }

  function handleDeclineUserInvitation(id: number) {
    props.declineUserInvitation(id);
  }

  function getDropdownItems(invitation: any) {
    const { status, userInvitationId } = invitation;
    const items = [];
    const resendItem = {
      id: 1,
      title: 'Resend',
      action: () => handleResendUserInvitation(userInvitationId),
    };
    const declineItem = {
      id: 2,
      title: 'Decline',
      action: () => handleDeclineUserInvitation(userInvitationId),
    };
    if (status === NEW || status === EXPIRED || status === FAILED) {
      items.push(resendItem, declineItem);
    }
    if (status === ACCEPTED) {
      items.push(declineItem);
    }
    if (status === DECLINED) {
      items.push(resendItem);
    }
    return items;
  }

  return (
    <>
      <PageTitle
        titleHeading="User invitations"
        titleDescription="Table showing all existing user invitations."
      />
      <div>
        <Grid item container direction={'column'}>
          <Grid item sm={12}>
            <FormLabel className={classes.filterLabel}>Filter by: </FormLabel>
          </Grid>
          <Grid
            alignItems="flex-start"
            container
            direction={'row'}
            item
            spacing={1}
          >
            <Grid item>
              <FormControl
                className={
                  matches ? classes.formControl : classes.minFormControl
                }
                variant="outlined"
              >
                <TextField
                  label={'Organization'}
                  name={'organization'}
                  onChange={handleOrganizationChange}
                  value={organization}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  onChange={handleStatusChange}
                  value={status}
                >
                  <MenuItem value="">-</MenuItem>
                  <MenuItem value={NEW}>{NEW}</MenuItem>
                  <MenuItem value={ACCEPTED}>{ACCEPTED}</MenuItem>
                  <MenuItem value={DECLINED}>{DECLINED}</MenuItem>
                  <MenuItem value={EXPIRED}>{EXPIRED}</MenuItem>
                  <MenuItem value={FAILED}>{FAILED}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHeader
            headerCells={[
              { name: 'Organization' },
              { name: 'User' },
              { name: 'Status' },
              { name: 'Period', hideOnMobile: true },
              { name: 'Actions' },
            ]}
          />
          <TableBody>
            {(pageSize > 0
              ? userInvitations.slice(
                  pageNumber * pageSize,
                  pageNumber * pageSize + pageSize,
                )
              : userInvitations
            )
              .filter(
                (userInvitation: any) =>
                  userInvitation.status === status || status === '',
              )
              .filter((userInvitation: any) =>
                userInvitation.organizationEntity.name
                  .toLowerCase()
                  .includes(organization.toLowerCase()),
              )
              .map((userInvitation: any) => (
                <TableRow key={userInvitation.userInvitationId}>
                  <TableCell component="th" scope="row">
                    <a
                      href={RoutingUtil.buildLinkToEditOrganizationPage(
                        userInvitation.organizationEntity.id,
                      )}
                    >
                      {userInvitation.organizationEntity.name
                        .concat(' (')
                        .concat(
                          userInvitation.organizationEntity.organizationDomain,
                        )
                        .concat(')')}
                    </a>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {userInvitation.userEntity.email}
                  </TableCell>
                  <TableCell>
                    <span className={getBadgeColor(userInvitation.status)}>
                      {userInvitation.status}
                    </span>
                  </TableCell>
                  <TableCell hidden={isMobile}>
                    {formatInvitationDate(userInvitation.startDate)
                      .concat(' - ')
                      .concat(formatInvitationDate(userInvitation.endDate))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu items={getDropdownItems(userInvitation)} />
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
              <CustomTablePagination items={userInvitations} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isLoading: selectUserInvitationsLoadingState,
  userInvitations: selectUserInvitations,
  pageSize: selectPageSize,
  pageNumber: selectPageNumber,
  emptyRows: selectEmptyRows,
});

const mapDispatchToProps = (dispatch: UserInvitationDispatch) => ({
  fetchUserInvitations: () =>
    dispatch(userInvitationActions.fetchUserInvitations()),
  resendUserInvitation: (id: number) =>
    dispatch(userInvitationActions.resendUserInvitation(id)),
  declineUserInvitation: (id: number) =>
    dispatch(userInvitationActions.declineUserInvitation(id)),
  initPagination: () => dispatch({ type: 'INIT_PAGINATION' }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewInvitationsPage);
