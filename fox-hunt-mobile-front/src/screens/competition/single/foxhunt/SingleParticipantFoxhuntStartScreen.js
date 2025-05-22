import React, { useContext } from 'react';
import { Context as CompetitionContext } from '../../../../context/competition/active/CompetitionContext';
import GeneralCompetitionStartScreen from './../GeneralCompetitionStartScreen';
import { SINGLE_COMPETITION_HEADER } from '../../../../utils/constants/commonConstants';

const SingleParticipantFoxhuntStartScreen = ({ navigation }) => {
  const {
    initializeSingleCompetition,
    startSingleCompetition,
  } = useContext(CompetitionContext);

  return (
    <GeneralCompetitionStartScreen
      navigation={navigation}
      initializeSingleCompetition={initializeSingleCompetition}
      startSingleCompetition={startSingleCompetition}
      header={SINGLE_COMPETITION_HEADER}
    />

  );
};

export default SingleParticipantFoxhuntStartScreen;
