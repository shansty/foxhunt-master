import { useEffect, useRef } from 'react';
import { off, on } from './util/subscribe';

const defaultEvents = ['mousedown', 'touchstart'];

const useClickAway = (
  ref,
  onClickAway,
  addCondition,
  events = defaultEvents,
) => {
  const savedCallback = useRef(onClickAway);
  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);
  useEffect(() => {
    const handler = (event) => {
      const { current: el } = ref;
      const additionalCondition = addCondition ? addCondition(event) : true;
      el &&
        !el.contains(event.target) &&
        additionalCondition &&
        savedCallback.current(event);
    };
    for (const eventName of events) {
      on(document, eventName, handler);
    }
    return () => {
      for (const eventName of events) {
        off(document, eventName, handler);
      }
    };
  }, [events, ref, addCondition]);
};

export default useClickAway;
