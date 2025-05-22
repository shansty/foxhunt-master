import { USER_LOCATION_TIMEOUT } from '../constants/commonConstants';
import Geolocation from 'react-native-geolocation-service';
const getUserLocation = () => {
  const parameters = {
    enableHighAccuracy: true,
    timeout: USER_LOCATION_TIMEOUT,
    maximumAge: 1000,
  };
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (location) => (resolve(location)),
      (error) => (reject(error)),
      parameters,
    );
  });
};

export default getUserLocation;
