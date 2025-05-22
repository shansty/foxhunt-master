import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { makeStyles } from '@mui/styles';
import TableFooterComponent from '../TableFooterComponent';
import StarRatingComponent from '../StarRatingComponent';
import { formatDate } from '../../utils/formatUtil';
import {
  fetchFeedbacksByOrganizationId,
  patchFeedback,
} from '../../store/actions/userFeedbackActions';
import {
  selectUserFeedbacksAllSizeMap,
  selectUserFeedbacksIsLoading,
  selectUserFeedbacksMap,
} from '../../store/selectors/userFeedbackSelectors';
import { Organization } from '../../types/Organization';
import { UserFeedbackDispatch } from '../../types/Dispatch';
import { Feedback } from '../../types/Feedback';

const useStyles = makeStyles({
  messageCell: {
    maxWidth: 300,
  },
});

interface FeedbackTableComponentProps {
  allSize: any;
  isLoading: boolean;
  organization: Organization;
  userFeedbacks: Map<number, Feedback[]>;
  fetchUserFeedbacks(
    id: number | undefined,
    pager: {
      page: number;
      size: number;
    },
  ): void;
  patchFeedback(feedback: Feedback): void;
}

const FeedbackTableComponent = ({
  allSize,
  fetchUserFeedbacks,
  isLoading,
  organization,
  patchFeedback,
  userFeedbacks,
}: FeedbackTableComponentProps) => {
  const classes = useStyles();
  const initialState = {
    pager: {
      page: 0,
      rowsPerPage: 25,
    },
  };
  const [state, setState] = useState(initialState);
  const feedbacks =
    organization.id && userFeedbacks.get(organization.id)
      ? userFeedbacks.get(organization.id)
      : [];
  const size = allSize.get(organization.id);

  const onPageChange = (pager = { page: 0, rowsPerPage: 25 }) => {
    const newPager = Object.assign(state.pager, pager);
    const newState = { ...state, pager: newPager };
    setState(newState);

    fetchUserFeedbacks(organization.id, {
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  };

  const markFeedbackAsRead = (feedback: Feedback) => {
    feedback.hasRead = true;
    patchFeedback(feedback);
    fetchUserFeedbacks(organization.id, {
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  };

  useEffect(() => {
    fetchUserFeedbacks(organization.id, {
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  }, []);

  if (!feedbacks) {
    return (
      <TableBody>
        <TableRow>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <td colSpan={5}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell colSpan={5}>
                There are currently no feedbacks
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </td>
    );
  }

  return (
    <td colSpan={5}>
      <Table>
        <TableBody>
          {feedbacks.map((feedback: Feedback) => (
            <TableRow key={feedback.comment}>
              <TableCell padding="checkbox" />
              <TableCell className={classes.messageCell} align={'justify'}>
                {feedback.comment}
              </TableCell>
              <TableCell>
                <StarRatingComponent rating={feedback.ranking} />
              </TableCell>
              <TableCell>{feedback.user?.email}</TableCell>
              <TableCell>{formatDate(feedback.sendDate)}</TableCell>
              <TableCell>
                {!feedback.hasRead && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => markFeedbackAsRead(feedback)}
                  >
                    Mark as read
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooterComponent
          pager={state.pager}
          onChange={onPageChange}
          countAllRows={size}
        />
      </Table>
    </td>
  );
};

const mapStateToProps = createStructuredSelector({
  allSize: selectUserFeedbacksAllSizeMap,
  isLoading: selectUserFeedbacksIsLoading,
  userFeedbacks: selectUserFeedbacksMap,
});

const mapDispatchToProps = (dispatch: UserFeedbackDispatch) => ({
  fetchUserFeedbacks: (organizationId: number, params: any) =>
    dispatch(fetchFeedbacksByOrganizationId(organizationId, params)),
  patchFeedback: (feedback: any) => dispatch(patchFeedback(feedback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbackTableComponent);
