import { ACTIVE_COMPETITION_API_PATH } from '../../api/constants';
import { useParams } from 'react-router-dom';

export const useSsePath = () => {
  const { id } = useParams();
  return `/active-competitions/${id}/subscription`;
};

export const useSseFinishPath = () => {
  const { id } = useParams();
  return `/active-competitions/${id}/finish`;
};
