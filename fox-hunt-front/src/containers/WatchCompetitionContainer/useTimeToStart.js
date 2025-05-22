import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addEventListener } from '../../store/actions/sseActions';
import { parseEventMessage } from './utils';
import { useSsePath } from './useSsePath';
import { useEventSource } from './useEventSource';

const INITIAL_NOTIFICATION = 'INITIAL_NOTIFICATION';

export const useTimeToStart = (initialState) => {
  const dispatch = useDispatch();
  const ssePath = useSsePath();
  const eventSource = useEventSource();
  const [timeToStart, setTimeToStart] = useState(initialState);

  const eventListener = useCallback((event) => {
    const data = parseEventMessage(event);
    if (data) setTimeToStart(data.timeToStart);
  }, []);

  const subscribeToEvent = useCallback(() => {
    if (eventSource) {
      dispatch(
        addEventListener({
          event: INITIAL_NOTIFICATION,
          listener: eventListener,
          eventSource,
          identity: ssePath,
        }),
      );
    }
  }, [dispatch, eventSource, ssePath, eventListener]);

  useEffect(() => {
    subscribeToEvent();
  }, [eventSource, subscribeToEvent]);

  return timeToStart;
};
