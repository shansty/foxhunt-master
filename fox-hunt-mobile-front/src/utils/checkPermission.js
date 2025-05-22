import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import { Platform } from 'react-native';

const checkPermission = async () => {
  try {
    const checkPermissionResult = await check(Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }));
    switch (checkPermissionResult) {
      case RESULTS.UNAVAILABLE:
        return false;
      case RESULTS.DENIED:
        const permissionRequest = await request(Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }));
        return permissionRequest === RESULTS.GRANTED;
      case RESULTS.LIMITED:
        return false;
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        return false;
    }
  } catch (error) {
    return false;
  }
};

export default checkPermission;
