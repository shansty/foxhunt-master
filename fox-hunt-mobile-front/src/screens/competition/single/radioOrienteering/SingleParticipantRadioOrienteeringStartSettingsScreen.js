import React, { useContext } from 'react';
import { Context as CompetitionContext } from '../../../../context/competition/active/CompetitionContext';
import GeneralCompetitionStartSettingsScreen from '../GeneralCompetitionStartSettingsScreen';

const SingleParticipantRadioOrienteeringStartSettingsScreen = ({ navigation }) => {
  const {
    initializeSingleCompetition,
    startSingleRadioOrienteeringCompetition,
  } = useContext(CompetitionContext);

  return (
    <GeneralCompetitionStartSettingsScreen
      navigation={navigation}
      initializeSingleCompetition={initializeSingleCompetition}
      startSingleCompetition={startSingleRadioOrienteeringCompetition}
    />
  );
};

export default SingleParticipantRadioOrienteeringStartSettingsScreen;
