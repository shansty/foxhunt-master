import React from 'react';
import { Text } from 'react-native';
import {
  METERS_IN_KILOMETER,
  TWO_FRACTION_DIGITS,
  DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS,
} from '../../../utils/constants/commonConstants';
import { styles } from '../statistics/styles';
import { distanceBetweenTwoPoints } from '../../../utils/mapUtils';

const DebugAdditions = React.memo(({ userLocation, calculatedSoundLevel, volume, gameState })=> {
  const distanceToCurrentFox = distanceBetweenTwoPoints(
    [userLocation.latitude, userLocation.longitude],
    gameState.currentFox?.coordinates.coordinates,
    METERS_IN_KILOMETER,
  ) - DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS;

  return (
    <>
      {distanceToCurrentFox >= 0 ?
        <Text style={styles.descriptionText}>
             To current fox {distanceToCurrentFox} m
        </Text> :
        <Text style={styles.descriptionText}>Silence interval</Text>
      }
      <Text style={styles.descriptionText}>
         Angle to North: {userLocation.angleToNorth ?
          userLocation.angleToNorth :
          'Change your location to treat data'
        }
      </Text>
      <Text style={styles.descriptionText}>
         Angle to Point: {userLocation.angleToPoint ?
          userLocation.angleToPoint.toFixed(TWO_FRACTION_DIGITS) :
          'Change your location to treat data'
        }
      </Text>
      <Text style={styles.descriptionText}>
         Calculated sound level: {calculatedSoundLevel ?
          Math.round(calculatedSoundLevel) :
          0
        }
      </Text>
      <Text style={styles.descriptionText}>
         Angle sound level: {calculatedSoundLevel ?
          Math.round(calculatedSoundLevel * 2 - volume) :
          0
        }
      </Text>
    </>
  );
},
);
DebugAdditions.displayName = 'DebugAdditions';


export default DebugAdditions;
