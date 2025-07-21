import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Chip, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeader } from 'common-front';
import { getColorFromConfig } from 'src/utils/';
import { formatTimeOnly } from 'src/utils/formatUtil';
import * as FoxHuntPropTypes from 'src/utils/FoxHuntPropTypes';

const msInMinute = 60000;

const UserResultsTable = ({ config, replay, userResults }) => {
  const getChipColor = (userResult) => {
    switch (userResult.currentPosition) {
      case 1:
        return '#ffd700';
      case 2:
        return 'silver';
      case 3:
        return '#CD7F32';
      default:
        return '#d3d3d394';
    }
  };

  if (!userResults) {
    return;
  }

  const calculateDuration = (ms) => {
    const minutes = Math.floor(dayjs(ms).minute());
    const msLeft = ms - minutes * msInMinute;
    const seconds = Math.floor(dayjs(msLeft).second());
    return `${minutes}:${seconds}`;
  };

  return (
    <Table>
      <TableHeader
        headerCells={[
          { name: '№' },
          { name: 'Name' },
          { name: '' },
          { name: 'Foxes' },
          { name: 'Start time' },
          { name: 'Finish time' },
          replay ? { name: 'Duration' } : {},
        ]}
      />
      <TableBody>
        {userResults.map((result) => (
          <TableRow key={result.user.id}>
            <TableCell align={'justify'} sx={{ pl: 1 }}>
              <Chip
                label={result.currentPosition}
                style={{ backgroundColor: getChipColor(result) }}
              />
            </TableCell>
            <TableCell align={'justify'}>
              <Chip
                size={'small'}
                sx={{ mr: 1 }}
                style={{
                  backgroundColor: getColorFromConfig(config, result.user?.id),
                }}
              />
              {`${result.user?.firstName} ${result.user?.lastName}`}
            </TableCell>
            <TableCell align={'justify'}>
              {result?.isDisconnected && (
                <Chip
                  variant={'outlined'}
                  color={'error'}
                  label={'Disconnected'}
                ></Chip>
              )}
            </TableCell>
            <TableCell align={'justify'}>{result.foundFoxes}</TableCell>
            <TableCell align={'justify'}>
              {formatTimeOnly(result.startDate)}
            </TableCell>
            <TableCell align={'justify'}>
              {result.finishDate ? formatTimeOnly(result.finishDate) : ''}
            </TableCell>
            {replay && (
              <TableCell align={'justify'}>
                {calculateDuration(result.gameTime)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

UserResultsTable.propTypes = {
  userResults: PropTypes.arrayOf(
    PropTypes.shape({
      completeCompetition: PropTypes.bool,
      completedOrInGame: PropTypes.bool,
      currentPosition: PropTypes.number,
      finishDate: PropTypes.string,
      foundFoxes: PropTypes.number,
      gameTime: PropTypes.number,
      startDate: PropTypes.string,
      startPosition: PropTypes.number,
      user: FoxHuntPropTypes.user.propTypes,
    }),
  ).isRequired,
  config: PropTypes.shape({
    colors: PropTypes.array,
  }),
};

export default UserResultsTable;
