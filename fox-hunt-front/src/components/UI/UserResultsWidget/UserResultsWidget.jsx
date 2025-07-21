import PropTypes from 'prop-types';
import React from 'react';
import UserResultsContent from './UserResultContent';
import Grid from '@mui/material/Grid';

const UserResultsWidget = (props) => {
  const { userResults, config } = props;

  const midArrNumber = Math.ceil(userResults.length / 2);

  if (!userResults) {
    return;
  }

  const description = {
    user: { firstName: 'Name' },
    currentPosition: '№',
    foundFoxes: 'Foxes',
    startDate: 'Start time',
    finishDate: 'Finish time',
    startPosition: 'Start position',
  };

  return (
    <>
      <h3 className="text-center">Results </h3>
      <Grid container sx={{ display: { sm: 'none', md: 'block' } }}>
        <Grid item md={6}>
          <UserResultsContent
            userResults={userResults.slice(0, midArrNumber)}
            header={description}
            config={config}
          />
        </Grid>
        <Grid item md={6}>
          <UserResultsContent
            userResults={userResults.slice(midArrNumber, userResults.length)}
            header={description}
            config={config}
          />
        </Grid>
      </Grid>
      <Grid item sm xs sx={{ display: { xl: 'none' } }}>
        <UserResultsContent
          userResults={userResults}
          header={description}
          config={config}
        />
      </Grid>
    </>
  );
};

UserResultsWidget.propTypes = {
  userResults: PropTypes.array.isRequired,
  config: PropTypes.shape({
    colors: PropTypes.array,
  }),
};

export default UserResultsWidget;
