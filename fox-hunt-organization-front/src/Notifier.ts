import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { removeSnackbar } from './store/actions/notificationActions';
import { selectNotifications } from './store/selectors/notificationSelector';
import { Notification } from './types/Notification';
import { NotificationDispatch } from './types/Dispatch';

interface NotifierProps {
  notifications: Notification[];
  removeSnackbar: (key: number | string) => void;
}

function Notifier(props: NotifierProps) {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notifications } = props;
  const [displayed, setDisplayed] = useState<any[]>([]);

  const storeDisplayed = (id?: number | string) => {
    setDisplayed([...displayed, id]);
  };

  const removeDisplayed = (id: number | string) => {
    setDisplayed([...displayed.filter((key) => id !== key)]);
  };

  useEffect(() => {
    notifications.forEach(
      ({ key, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          closeSnackbar(key);
          return;
        }

        if (displayed.includes(key)) {
          return;
        }

        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (event, myKey) => {
            props.removeSnackbar(myKey);
            removeDisplayed(myKey);
          },
        });
        storeDisplayed(key);
      },
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
}

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications,
});

const mapDispatchToProps = (dispatch: NotificationDispatch) => ({
  removeSnackbar: (key: number | string) => dispatch(removeSnackbar(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);
