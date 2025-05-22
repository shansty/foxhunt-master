import Geolocation from '@react-native-community/geolocation';
import {
  // COMPASS_UPDATE_RATE,
  USER_LOCATION_TIMEOUT,
  DISTANCE_TO_TRIGGER_CALLBACK,
} from '../constants/commonConstants';
// import RNSimpleCompass from 'react-native-simple-compass';

const subscribeToUserLocation = (
  changeParticipantPosition,
  changeParticipantDirection,
  setIsError,
) => {
  const parameters = {
    enableHighAccuracy: true,
    distanceFilter: DISTANCE_TO_TRIGGER_CALLBACK,
    timeout: USER_LOCATION_TIMEOUT,
    maximumAge: 1000,
  };
  const observerId = Geolocation.watchPosition(
    (position) => {
      changeParticipantPosition(position, observerId);
    },
    (error) => {
      setIsError(true);
      console.log(`${ error }`);
    },
    parameters,
  );
  // RNSimpleCompass.start(COMPASS_UPDATE_RATE, (degree) => {
  //   changeParticipantDirection(degree);
  // });
};

export default subscribeToUserLocation;
