import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { createStructuredSelector } from 'reselect';
import {
  selectAllOrganizations,
  selectError,
  selectOrganizationLoadingState,
} from '../../store/selectors/orgnizationSelectors';
import * as organizationActions from '../../store/actions/organizationActions';
import ExpandableTableRow from '../../component/ExpandableTableRow';
import FeedbackTableComponent from '../../component/FeedbackTableComponent';
import { Organization } from '../../types/Organization';
import { OrganizationDispatch } from '../../types/Dispatch';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  messageCell: {
    maxWidth: 300,
  },
});

interface UserFeedbackPageProps {
  organizations: Organization[];
  error: string | null;
  fetchOrganizations: () => void;
}

const UserFeedbackPage = (props: UserFeedbackPageProps) => {
  const classes = useStyles();
  const title = 'Organization feedbacks';
  const description = 'Table shows all organizations with feedbacks';
  const { organizations } = props;

  useEffect(() => {
    props.fetchOrganizations();
  }, []);

  return (
    <>
      <PageTitle titleHeading={title} titleDescription={description} />
      <TableContainer component={Paper} className={classes.root}>
        <Table className={classes.table}>
          <TableBody>
            {organizations.map((organization: Organization) => (
              <ExpandableTableRow
                key={organization.id}
                expandComponent={
                  <FeedbackTableComponent organization={organization} />
                }
              >
                <TableCell>{organization.name}</TableCell>
              </ExpandableTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isLoading: selectOrganizationLoadingState,
  organizations: selectAllOrganizations,
});

const mapDispatchToProps = (dispatch: OrganizationDispatch) => ({
  fetchOrganizations: () => dispatch(organizationActions.fetchOrganizations()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserFeedbackPage);
