import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { SENTRY_DSN } from '@env';
import GeneralNavigationContainer
  from './navTools/navigation/GeneralNavigationContainer';
import { Provider as AuthProvider } from './context/AuthContext';
import SplashScreen from 'react-native-splash-screen';
import { Provider as UpcomingCompetitionProvider }
  from './context/competition/UpcomingCompetitionContext';
import { Provider as CompetitionProvider } from './context/competition/active/CompetitionContext';
import { Provider as CommonProvider } from './context/CommonContext';
import { ModalPortal } from 'react-native-modals';

if (__DEV__) {
  import('../ReactoronConfig');
}
// Ios need to add icon vector, react-navigation, google authetication,
// tune dotenv(in device settings), check permission for http requests,
// map settings(set new API_KEY and switch on Maps SDK for Android and IOS),
// link react-native-sound, add Location in info.plist, add rn-fetch-blob  ....

Sentry.init({
  dsn: SENTRY_DSN,
});

export const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <CompetitionProvider>
      <UpcomingCompetitionProvider>
        <AuthProvider>
          <CommonProvider>
            <GeneralNavigationContainer />
            <ModalPortal />
          </CommonProvider>
        </AuthProvider>
      </UpcomingCompetitionProvider>
    </CompetitionProvider>
  );
};
