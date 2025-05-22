import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

import PropTypes from 'prop-types';
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material';

function UserResultCard(props) {
  const { userResult, isHeader, numberColor } = props;

  const getChipColor = () => {
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

  const StyledCardContent = styled(CardContent)({
    padding: 0,
    paddingBottom: 0,
    ['&:last-child']: {
      paddingBottom: 0,
    },
  });

  const StyledChip = styled(Chip)({
    background: getChipColor(),
    ['& span']: {
      color: numberColor,
    },
  });

  return (
    <Paper elevation={2} sx={{ mb: 1 }}>
      <Card>
        <StyledCardContent>
          <Box display="flex" p={1}>
            <Grid item xs={1}>
              {isHeader ? (
                userResult.currentPosition
              ) : (
                <StyledChip label={userResult.currentPosition} />
              )}
            </Grid>
            <Grid item xs={4}>
              {`${userResult.user.firstName} ${
                userResult.user.lastName ? userResult.user.lastName : ''
              }`}
            </Grid>
            <Grid item xs={2}>
              {userResult.foundFoxes}
            </Grid>
            <Grid item xs={4}>
              {userResult.startDate}
            </Grid>
            <Grid item xs={4}>
              {userResult.finishDate ? userResult.finishDate : ''}
            </Grid>
          </Box>
        </StyledCardContent>
      </Card>
    </Paper>
  );
}
UserResultCard.defaultProps = { isHeader: false, numberColor: 'black' };

UserResultCard.propTypes = {
  userResult: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string,
    }).isRequired,

    startPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    foundFoxes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startDate: PropTypes.string.isRequired,
    finishDate: PropTypes.string,
  }),
  isHeader: PropTypes.bool,
  numberColor: PropTypes.string,
};

export default UserResultCard;
