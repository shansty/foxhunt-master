import { useDispatch } from 'react-redux';

import { enqueueSnackbar } from 'src/store/actions/notificationsActions';
import { createErrorMessage } from 'src/utils/notificationUtil';

export default function useErrorMessage(message) {
  const dispatch = useDispatch();

  const showErrorMessage = () => {
    dispatch(enqueueSnackbar(createErrorMessage(message, dispatch)));
  };
  return showErrorMessage;
}
