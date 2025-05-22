import React from 'react';
import COLORS from '../../utils/constants/colors';
import { RNNotificationBanner } from 'react-native-notification-banner';
import { MILLISECONDS_IN_SECOND } from '../../utils/constants/commonConstants';

const OutOfPolygonNotification = React.memo(({ competitionDuration, positionOutOfLocation }) => {
  return positionOutOfLocation ?
    RNNotificationBanner.Show({
      title: 'Warning!',
      subTitle: 'You have left the competition area, please go back to continue participation',
      withIcon: false,
      tintColor: COLORS.red,
      duration: competitionDuration * MILLISECONDS_IN_SECOND,
    }): RNNotificationBanner.Dismiss();
},
);

OutOfPolygonNotification.displayName = 'OutOfPolygonNotification';

export default OutOfPolygonNotification;
