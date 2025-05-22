import { useSelector } from 'react-redux';
import { useSsePath } from './useSsePath';
import { selectSseEventSource } from '../../store/selectors/sseSelectors';

export const useEventSource = () => {
  const ssePath = useSsePath();
  return useSelector((state) => selectSseEventSource(state, ssePath));
};
