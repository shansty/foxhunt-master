import { useContext, useEffect } from 'react';
import { Context as CompetitionContext } from '../context/competition/active/CompetitionContext';
import { TWO_FRACTION_DIGITS } from '../utils/constants/commonConstants';
import { COMMAND_COMPETITION_RESULT_SCREEN } from '../utils/constants/routeNames';

const useCommandCompetition = (navigation, eventSource) => {
  const {
    state,
    setTrackerInfo,
    finishCommandCompetition,
    changeFrequency,
    finishParticipation,
  } = useContext(CompetitionContext);

  const stop = async (source) => {
    await finishParticipation(state);
    await finishCommandCompetition(source, state);
    navigation.navigate(COMMAND_COMPETITION_RESULT_SCREEN);
  };

  useEffect(() => {
    state.userLocation.latitude && setTrackerInfo(state.competition.id, {
      coordinates: {
        coordinates: [state.userLocation.latitude, state.userLocation.longitude],
        type: 'Point',
      },
    });
  }, [state.userLocation.latitude, state.userLocation.longitude]);

  useEffect(() => {
    if (!!state.gameState.currentFox) {
      const frequencyCloseness = +Math.abs(state.gameState.currentFox.frequency - state.frequency)
        .toFixed(TWO_FRACTION_DIGITS);
      changeFrequency(state.frequency, frequencyCloseness);
    }
  }, [state.gameState.currentFox]);

  useEffect(() => {
    if (state.foundFoxes === state.competition.foxAmount) {
      stop(eventSource);
    }
  }, [state.foundFoxes]);
  return {
    stop,
  };
};

export default useCommandCompetition;
