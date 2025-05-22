import { useContext, useEffect } from 'react';
import { MILLISECONDS_IN_SECOND } from '../utils/constants/commonConstants';
import { Context as CompetitionContext } from '../context/competition/active/CompetitionContext';
import { SINGLE_PARTICIPANT_RESULT_SCREEN } from '../utils/constants/routeNames';

const useSingleCompetition = (navigation) => {
  const {
    state,
    setFoxTimerId,
    findFoxInSingleCompetition,
    changeCurrentFoxInSingleCompetition,
    positionOutOfLocationInSingleCompetition,
    trackGameState,
    finishParticipation,
    storeGameState,
  } = useContext(CompetitionContext);

  const stop = async () => {
    await finishParticipation(state);
    storeGameState(state);
    navigation.navigate(SINGLE_PARTICIPANT_RESULT_SCREEN);
  };

  useEffect(() => {
    if (state.foxTimerId >= 0) {
      clearTimeout(state.foxTimerId);
    }

    const foxTimer = setTimeout(() => changeCurrentFoxInSingleCompetition(state),
      state.competition.foxDuration * MILLISECONDS_IN_SECOND);
    setFoxTimerId(foxTimer);
  }, [state.gameState.currentFox]);

  useEffect(() => {
    positionOutOfLocationInSingleCompetition(state);
    findFoxInSingleCompetition(state, changeCurrentFoxInSingleCompetition);
    // You can comment this call of trackGameState, when you are dev
    trackGameState(state);
  }, [state.userLocation.latitude]);

  useEffect(() => {
    if (state.gameState.foundFoxes === state.competition.foxAmount) {
      stop();
    }
  }, [state.gameState.foundFoxes]);

  return {
    stop,
  };
};

export default useSingleCompetition;
