import React from 'react';
import COLORS from '../../utils/constants/colors';
import { RNNotificationBanner } from 'react-native-notification-banner';
import { MILLISECONDS_IN_SECOND } from '../../utils/constants/commonConstants';

const WarningNotification = React.memo(({ isVisible, title, subTitle }) => {
  const DURATION_OF_SHOWING = 5;
  return isVisible &&
      RNNotificationBanner.Show({
        title,
        subTitle,
        withIcon: false,
        tintColor: COLORS.yellow,
        duration: DURATION_OF_SHOWING * MILLISECONDS_IN_SECOND,
      });
},
);

WarningNotification.displayName = 'WarningNotification';

export default WarningNotification;
