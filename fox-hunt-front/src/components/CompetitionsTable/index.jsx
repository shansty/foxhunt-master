import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { TableHeader } from 'common-front';
import DropdownMenu from '../DropdownMenu';
import { buildLaunchCompetitionByIdUrl } from '../../api/utils/navigationUtil';
import { formatDate } from '../../utils';
import TableFooterComponent from '../TableFooter';

function CompetitionsTable(props) {
  const { competitions, pager, onPageChange, countAllRows, loggedUser } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHeader
          headerCells={[
            { name: '#' },
            { name: 'Name' },
            { name: 'Location' },
            { name: 'Date' },
            { name: 'Coach' },
            { name: 'Participants' },
            { name: 'Operations' },
          ]}
        />
        <TableBody>
          {competitions.map((competition) => (
            <TableRow key={competition.id}>
              <TableCell scope="row" align={'justify'}>
                {competition.id}
              </TableCell>
              <TableCell align={'justify'}>{competition.name}</TableCell>
              <TableCell align={'justify'}>
                {competition.location.name}
              </TableCell>
              <TableCell align={'justify'}>
                {formatDate(competition.startDate)}
              </TableCell>
              <TableCell align={'justify'}>
                {competition.coach && `${competition.coach.firstName} `}
                {competition.coach &&
                  competition.coach.lastName &&
                  `${competition.coach.lastName}`}
              </TableCell>
              <TableCell align={'justify'}>
                {competition.participants.length}
              </TableCell>
              <TableCell align={'justify'}>
                {loggedUser.id === competition.coach.id && (
                  <DropdownMenu
                    items={[
                      {
                        id: competition.id,
                        title: 'Start',
                        to: buildLaunchCompetitionByIdUrl(competition.id),
                      },
                    ]}
                  />
                )}
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
    </TableContainer>
  );
}

export default CompetitionsTable;
