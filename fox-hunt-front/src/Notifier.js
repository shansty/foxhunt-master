import { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNotifications } from './store/selectors/notificationSelectors';
import { removeSnackbar } from './store/actions/notificationsActions';

function Notifier({ notifications, removeSnackbar }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [displayed, setDisplayed] = useState([]);

  const storeDisplayed = useCallback(
    (id) => {
      setDisplayed([...displayed, id]);
    },
    [displayed],
  );

  const removeDisplayed = useCallback(
    (id) => {
      setDisplayed([...displayed.filter((key) => id !== key)]);
    },
    [displayed],
  );

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
            removeSnackbar(myKey);
            removeDisplayed(myKey);
          },
        });
        storeDisplayed(key);
      },
    );
  }, [
    notifications,
    closeSnackbar,
    enqueueSnackbar,
    dispatch,
    displayed,
    removeDisplayed,
    storeDisplayed,
    removeSnackbar,
  ]);

  return null;
}

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications,
});

const mapDispatchToProps = (dispatch) => ({
  removeSnackbar: (key) => dispatch(removeSnackbar(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);
