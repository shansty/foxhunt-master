import React, { useContext } from 'react';
import { Context as CompetitionContext }
  from '../../../../context/competition/active/CompetitionContext';
import GeneralCompetitionStartScreen from '../GeneralCompetitionStartScreen';
import { RADIO_ORIENTEERING_HEADER } from '../../../../utils/constants/commonConstants';

const SingleParticipantRadioOrienteeringStartScreen = ({ navigation }) => {
  const {
    initializeSingleCompetition,
    startSingleRadioOrienteeringCompetition,
  } = useContext(CompetitionContext);
  return (
    <GeneralCompetitionStartScreen
      navigation={navigation}
      initializeSingleCompetition={initializeSingleCompetition}
      startSingleCompetition={startSingleRadioOrienteeringCompetition}
      header={RADIO_ORIENTEERING_HEADER}
    />
  );
};

export default SingleParticipantRadioOrienteeringStartScreen;
