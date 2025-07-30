import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { addEventListener } from '../../store/actions/sseActions';
import { useSsePath } from './useSsePath';
import { useEventSource } from './useEventSource';
import { parseEventMessage } from './utils';

const defaultDataConverter = (data) => data;

export const useSseMessage = (
  initialState,
  event,
  sseDataConverter = defaultDataConverter,
) => {
  const ssePath = useSsePath();
  const dispatch = useDispatch();
  const eventSource = useEventSource();
  const [message, setMessage] = useState(initialState);

  const eventListener = useCallback(
    (event) => {
      const data = parseEventMessage(event);
      if (data) setMessage(sseDataConverter(data));
      console.log("🔥 incoming SSE event data:", data);
    },
    [sseDataConverter],
  );

  const subscribeToEvent = useCallback(() => {
    if (eventSource) {
      dispatch(
        addEventListener({
          event: event,
          eventSource: eventSource,
          identity: ssePath,
          listener: eventListener,
        }),
      );
    }
  }, [eventSource, dispatch, ssePath, eventListener, event]);

  useEffect(() => {
    subscribeToEvent();
  }, [eventSource, subscribeToEvent]);

  return message;
};
