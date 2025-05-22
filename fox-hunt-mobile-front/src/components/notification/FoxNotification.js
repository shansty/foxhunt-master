import React from 'react';
import COLORS from '../../utils/constants/colors';
import { RNNotificationBanner } from 'react-native-notification-banner';
import { MILLISECONDS_IN_SECOND } from '../../utils/constants/commonConstants';

const FoxNotification = React.memo(({ isFoxFound }) => {
  const DURATION_OF_SHOWING = 5;
  return isFoxFound &&
      RNNotificationBanner.Show({
        title: 'Congratulations!',
        subTitle: 'You have found a fox.',
        withIcon: false,
        tintColor: COLORS.green,
        duration: DURATION_OF_SHOWING * MILLISECONDS_IN_SECOND,
      });
},
);

FoxNotification.displayName = 'FoxNotification';

export default FoxNotification;
