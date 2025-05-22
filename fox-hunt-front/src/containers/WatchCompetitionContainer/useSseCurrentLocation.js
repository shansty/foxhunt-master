import { useSseMessage } from './useSseMessage';

const EVENT = 'CURRENT_LOCATION';

export const useActiveFox = (initialState) =>
  useSseMessage(initialState, EVENT);
