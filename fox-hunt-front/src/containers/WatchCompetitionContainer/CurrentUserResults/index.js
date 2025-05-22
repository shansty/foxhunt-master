import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { competition as CompetitionShape } from '../../../utils/FoxHuntPropTypes';
import { Button, Typography, Grid } from '@mui/material';
import UserResultsTable from '../../../components/UserResultsTable';
import { getColorConfig } from '../../../utils/index';
import {
  useCompetitionResult,
  useCurrentParticipantTrackers,
} from '../useSseEvent';
import { selectGameResults } from '../../../store/selectors/competitionSelectors';
import { getCompetitionResultFromSseResultMessage } from '../utils';
import { useIsMobile } from 'common-front';

function CurrentUserResults({ competitionId, competition }) {
  const [isSmallUserResultShown, setIsSmallUserResultShown] = useState(false);
  const initialResults = useSelector(selectGameResults);
  const isMobile = useIsMobile();
  const participantTrackers = useCurrentParticipantTrackers([]);

  const isTableHidden = useMemo(
    () => (isMobile && isSmallUserResultShown) || !isMobile,
    [isMobile, isSmallUserResultShown],
  );

  const dataConverter = useCallback(
    (data) => getCompetitionResultFromSseResultMessage(competitionId, data),
    [competitionId],
  );

  const currentUserResults = useCompetitionResult([], dataConverter);

  const smallUserResultButton = useMemo(
    () => (isSmallUserResultShown ? 'Hide user result' : 'Show user result'),
    [isSmallUserResultShown],
  );

  const userResults = useMemo(() => {
    if (currentUserResults.length) return currentUserResults;

    return initialResults.map((result) => {
      const participant = participantTrackers.find(
        (participant) => participant.participantId === result.user?.id,
      );
      const participantIsDisconnected = participant
        ? participant?.trackerList[0]?.isDisconnected
        : true;

      return Object.assign({}, result, {
        isDisconnected: participantIsDisconnected,
      });
    });
  }, [currentUserResults, initialResults, participantTrackers]);

  const tableConfig = useMemo(
    () => ({
      color: getColorConfig(competition.participants),
    }),
    [competition],
  );

  const toggleUserResultTable = () => {
    setIsSmallUserResultShown(!isSmallUserResultShown);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item container direction="column" spacing={1} alignItems="center">
        <Grid item>
          <Button
            sx={{ display: { sm: 'block', md: 'none' }, mt: 1 }}
            variant="contained"
            color="primary"
            onClick={toggleUserResultTable}
          >
            {smallUserResultButton}
          </Button>
        </Grid>
        {isTableHidden && (
          <Grid item>
            <Typography variant="h3">Results</Typography>
          </Grid>
        )}
      </Grid>
      {isTableHidden && (
        <Grid item container direction="column" spacing={3}>
          <Grid item>
            <UserResultsTable userResults={userResults} config={tableConfig} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

CurrentUserResults.propTypes = {
  competitionId: PropTypes.string.isRequired,
  competition: CompetitionShape.propTypes.isRequired,
};

export default CurrentUserResults;
