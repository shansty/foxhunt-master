import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { DropdownMenu, TableHeader } from 'common-front';
import AlertDialog from 'src/components/AlertDialog';
import TableFooterComponent from 'src/components/TableFooter';
import {
  DELETE_COMPETITION_TEXT,
  DELETE_COMPETITION_TITLE,
} from 'src/constants/alertConst';
import {
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_RUNNING,
  STATUS_SCHEDULED,
} from 'src/constants/competitionStatusConst';
import { getAllCompetitionDropDownMenuItems } from './utils';
import { formatDate } from 'src/utils';

function ListCompetitions({
  competitions,
  countAllRows,
  fetchCompetitionAndRedirect,
  onPageChange,
  onRemoveProp,
  onSortCompetition,
  pager,
  sortOrder,
}) {
  const [open, setOpen] = useState(false);
  const [competitionToRemove, setCompetitionLocationToRemove] = useState(null);

  function remove(competition) {
    onRemoveProp(competition.id);
    closeAlertDialog();
  }

  function showAlertDialog(competition) {
    setCompetitionLocationToRemove(competition);
    setOpen(true);
  }

  function closeAlertDialog() {
    setOpen(false);
    setCompetitionLocationToRemove(null);
  }

  function getBadgeColor(status) {
    return clsx('m-1 badge', {
      'badge-success': status === STATUS_RUNNING,
      'badge-primary': status === STATUS_SCHEDULED,
      'badge-danger': status === STATUS_CANCELED,
      'badge-warning': status === STATUS_FINISHED,
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHeader
          direction={sortOrder}
          headerCells={[
            { name: '#' },
            { name: 'Name' },
            { name: 'Status' },
            { name: 'Location' },
            { name: 'Date', enableSorting: true, active: true },
            { name: 'Coach' },
            { name: 'Participants' },
            { name: 'Operation' },
          ]}
          sortingHandler={onSortCompetition}
        />
        <TableBody>
          {competitions.map((competition, index) => (
            <TableRow key={competition.id}>
              <TableCell scope="row" align={'justify'}>
                {pager.page * pager.rowsPerPage + ++index}
              </TableCell>
              <TableCell align={'justify'}>
                {competition.isPrivate && <LockIcon />}
                {competition.name}
              </TableCell>
              <TableCell align={'justify'}>
                <span className={getBadgeColor(competition.status)}>
                  {competition.status}
                </span>
              </TableCell>
              <TableCell align={'justify'}>
                {competition.location.name}
              </TableCell>
              <TableCell align={'justify'}>
                {formatDate(
                  competition.status === STATUS_FINISHED
                    ? competition.actualFinishDate
                    : competition.startDate,
                  competition.status === STATUS_SCHEDULED,
                )}
              </TableCell>
              <TableCell align={'justify'}>
                {competition.coach && `${competition.coach.firstName} `}
                {competition.coach &&
                  competition.coach.lastName &&
                  `${competition.coach.lastName}`}
              </TableCell>
              <TableCell align={'justify'}>
                {competition.participants?.length}
              </TableCell>
              <TableCell align={'justify'}>
                <DropdownMenu
                  items={getAllCompetitionDropDownMenuItems(
                    competition,
                    showAlertDialog,
                    fetchCompetitionAndRedirect,
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooterComponent
          pager={pager}
          onChange={onPageChange}
          countAllRows={countAllRows}
        />
      </Table>
      <AlertDialog
        open={open}
        onClose={closeAlertDialog}
        title={DELETE_COMPETITION_TITLE}
        text={DELETE_COMPETITION_TEXT}
        onSubmit={() => remove(competitionToRemove)}
      />
    </TableContainer>
  );
}

ListCompetitions.propTypes = {
  competitions: PropTypes.array.isRequired,
  onRemoveProp: PropTypes.func.isRequired,
};

export default ListCompetitions;
