import { useEffect, useContext, useState } from 'react';
import { Context as CompetitionContext }
  from '../context/competition/active/CompetitionContext';
import changeSoundTrack from '../utils/soundUtils/changeSoundTrack';
import changeSoundPlayerVolume from '../utils/soundUtils/changeSoundPlayerVolume';
import { calculateFrequency } from '../utils/competitionUtils';
import {
  INITIAL_FREQUENCY_CLOSENESS,
  TWO_FRACTION_DIGITS,
} from '../utils/constants/commonConstants';
import { BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const useCompetition = () => {
  const [isFinishModal, setFinishModal] = useState(false);

  const {
    state,
    setError,
    startParticipation,
    changeParticipantPosition,
    changeParticipantDirection,
    setCurrentSound,
    setCalculatedSoundLevel,
    changeFrequency,
    changeFrequencyCloseness,
  } = useContext(CompetitionContext);

  const start = async () => {
    startParticipation(
      changeParticipantPosition,
      changeParticipantDirection,
      setError,
      state.competition.startUserLocation,
    );
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      start();
    }
  }, [isFocused]);

  useEffect(() => {
    changeSoundTrack(state, setCurrentSound);
  }, [state.positionOutOfLocation, state.gameState.currentFox, state.frequencyCloseness]);

  useEffect(() => {
    changeSoundPlayerVolume(
      state.volume,
      state.userLocation.angleToPoint,
      setCalculatedSoundLevel,
      state.currentSound,
    );
  }, [state.volume, state.userLocation.angleToPoint]);

  useEffect(() => {
    changeFrequencyCloseness(state);
  }, [state.frequency, state.gameState.currentFox]);

  useEffect(() => {
    if (!!state.gameState.currentFox) {
      const frequencyCloseness = +Math.abs(state.gameState.currentFox.frequency - state.frequency)
        .toFixed(TWO_FRACTION_DIGITS);
      changeFrequency(state.frequency, frequencyCloseness);
    }
  }, [state.competition.currentFox]);

  useEffect(() => {
    const backAction = () => {
      setFinishModal(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const handleClickChangeFrequency = (fillPercentage) => {
    const frequency = calculateFrequency(fillPercentage, state.competition.frequency);
    const currentFoxFrequency = state.competition.foxPoints.find((fox) =>
      fox.index === state.gameState.currentFox.index).frequency;
    const frequencyCloseness = !!state.gameState.currentFox ?
      +Math.abs(currentFoxFrequency - frequency).toFixed(TWO_FRACTION_DIGITS) :
      INITIAL_FREQUENCY_CLOSENESS;
    changeFrequency(frequency, frequencyCloseness);
  };

  return {
    start,
    setFinishModal,
    isFinishModal,
    handleClickChangeFrequency,
  };
};

export default useCompetition;
