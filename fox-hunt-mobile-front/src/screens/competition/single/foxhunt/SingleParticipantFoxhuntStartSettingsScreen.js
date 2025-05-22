import React, { useContext } from 'react';
import { Context as CompetitionContext } from '../../../../context/competition/active/CompetitionContext';
import GeneralCompetitionStartSettingsScreen from '../GeneralCompetitionStartSettingsScreen';

const SingleParticipantFoxhuntStartSettingsScreen = ({ navigation }) => {
  const {
    initializeSingleCompetition,
    startSingleCompetition,
  } = useContext(CompetitionContext);

  return (
    <GeneralCompetitionStartSettingsScreen
      navigation={navigation}
      initializeSingleCompetition={initializeSingleCompetition}
      startSingleCompetition={startSingleCompetition}
    />
  );
};

export default SingleParticipantFoxhuntStartSettingsScreen;
