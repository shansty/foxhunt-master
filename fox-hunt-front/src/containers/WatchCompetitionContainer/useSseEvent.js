import { useSseMessage } from './useSseMessage';

const ACTIVE_FOX_EVENT = 'ACTIVE_FOX';

const CURRENT_LOCATION_EVENT = 'CURRENT_LOCATION';

const COMPETITION_RESULT_EVENT = 'COMPETITION_RESULT';

const COMPETITION_IS_EXPIRED = 'COMPETITION_IS_EXPIRED';

const PARTICIPANT_DISCONNECTED = 'PARTICIPANT_DISCONNECTED';

export const useActiveFox = (initialState) =>
  useSseMessage(initialState, ACTIVE_FOX_EVENT);

export const useCurrentParticipantTrackers = (initialState) =>
  useSseMessage(initialState, CURRENT_LOCATION_EVENT);

export const useCompetitionResult = (initialState, dataConverter) =>
  useSseMessage(initialState, COMPETITION_RESULT_EVENT, dataConverter);

export const useExpiredCompetition = (initialState) =>
  useSseMessage(initialState, COMPETITION_IS_EXPIRED);

export const useDisconnectedParticipant = (initialState) =>
  useSseMessage(initialState, PARTICIPANT_DISCONNECTED);
