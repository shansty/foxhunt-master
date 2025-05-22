import React from 'react';
import COLORS from '../../../utils/constants/colors';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { Dimensions, View } from 'react-native';
import {
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
  MAP_HEIGHT,
} from '../../../utils/constants/commonConstants';

const DebugMode = React.memo(({
  latitude,
  longitude,
  polygon,
  foxPoints,
  currentFox,
}) => {
  const boundingBox = polygon.coordinates.flat().reduce((acc, [latitude, longitude]) => {
    acc.minLatitude = acc.minLatitude <= latitude ? acc.minLatitude : latitude;
    acc.maxLatitude = acc.maxLatitude >= latitude ? acc.maxLatitude : latitude;
    return acc;
  }, {});

  const { width } = Dimensions.get('window');
  const ASPECT_RATIO = width / MAP_HEIGHT;

  const southwestLat = boundingBox.minLatitude;
  const northeastLat = boundingBox.maxLatitude;
  const latDelta = northeastLat - southwestLat;
  const lngDelta = latDelta * ASPECT_RATIO;

  const getFoxStatus = (foxPoint) => {
    return foxPoint.isFound ?
      '-found':
      foxPoint.id === currentFox?.id ? '-current' : '-not found';
  };

  return (
    <MapView
      style={{ width: width, height: 300, marginVertical: 10 }}
      region={{
        latitude: latitude,
        longitude: longitude,
        longitudeDelta: latDelta,
        latitudeDelta: lngDelta,
      }}
      showsUserLocation={true}
    >
      <Polygon
        coordinates={polygon.coordinates.map((arrayOfMap) =>
          arrayOfMap.map((coordinates) => ({
            latitude: coordinates[LATITUDE_INDEX],
            longitude: coordinates[LONGITUDE_INDEX],
          })),
        ).flat()}
        strokeColor={COLORS.blueBackground}
        fillColor={COLORS.pink}
        strokeWidth={3}
      />

      {foxPoints.map((foxPoint) =>
        <View key={foxPoint.id}>
          <Marker
            title={(foxPoint.index)
              .toString()
              .concat(getFoxStatus(foxPoint))
            }
            coordinate={{
              latitude: foxPoint.coordinates.coordinates[LATITUDE_INDEX],
              longitude: foxPoint.coordinates.coordinates[LONGITUDE_INDEX],
            }}
            key={`${foxPoint.id}-${getFoxStatus(foxPoint)}`}
            pinColor={foxPoint.isFound ?
              COLORS.blueBackground:
              foxPoint.id === currentFox?.id ? COLORS.green : COLORS.yellow}
          />
          <Polygon
            coordinates={foxPoint.catchingArea.coordinates.map((arrayOfMap) =>
              arrayOfMap.map((coordinates) => ({
                latitude: coordinates[LATITUDE_INDEX],
                longitude: coordinates[LONGITUDE_INDEX],
              })),
            ).flat()}
            strokeColor={COLORS.errorText}
            fillColor={COLORS.pink}
            strokeWidth={2}
          />
        </View>,
      )}
    </MapView>
  );
});

export default DebugMode;
