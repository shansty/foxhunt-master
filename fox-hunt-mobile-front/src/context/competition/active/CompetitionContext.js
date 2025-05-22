import createDataContext from '../../createDataContext';
import { CompetitionReducer } from './CompetitionReducer';
import { defaultState } from './CompetitionDefaultState';
import {
  changeFrequency,
  changeFrequencyCloseness,
  changeParticipantDirection,
  changeParticipantPosition,
  changeSoundVolume,
  clearState,
  finishParticipation,
  setCalculatedSoundLevel,
  setCurrentSound,
  setError,
  startParticipation,
} from './action/CompetitionActions';
import {
  createConnection, createSseConnection,
  finishCommandCompetition,
  initializeCommandCompetition, listenEvents, removeConnection,
  setCompetitions,
  setTrackerInfo,
  startCommandCompetition, updateActiveFox, updateCompetitionResult,
  updateLocationGame,
} from './action/CommandCompetitionActions';
import {
  initializeSingleCompetition,
  startSingleCompetition,
  setFoxTimerId,
  changeCurrentFoxInSingleCompetition,
  findFoxInSingleCompetition,
  positionOutOfLocationInSingleCompetition,
  trackGameState,
  storeGameState, startSingleRadioOrienteeringCompetition,
} from './action/SingleCompetitionActions';


export const { Provider, Context } = createDataContext(
  CompetitionReducer,
  {
    setError,
    changeSoundVolume,
    setCurrentSound,
    setCalculatedSoundLevel,
    changeFrequency,
    changeFrequencyCloseness,
    changeParticipantDirection,
    changeParticipantPosition,
    startParticipation,
    finishParticipation,
    clearState,

    setCompetitions,
    initializeCommandCompetition,
    startCommandCompetition,
    setTrackerInfo,
    finishCommandCompetition,
    createConnection,
    removeConnection,
    updateActiveFox,
    updateLocationGame,
    updateCompetitionResult,
    createSseConnection,
    listenEvents,


    initializeSingleCompetition,
    startSingleCompetition,
    setFoxTimerId,
    changeCurrentFoxInSingleCompetition,
    findFoxInSingleCompetition,
    positionOutOfLocationInSingleCompetition,
    trackGameState,
    storeGameState,
    startSingleRadioOrienteeringCompetition,
  },
  defaultState,
);
