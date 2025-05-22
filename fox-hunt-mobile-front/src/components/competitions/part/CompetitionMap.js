import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import COLORS from '../../../utils/constants/colors';
import {
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
  MAP_HEIGHT,
} from '../../../utils/constants/commonConstants';

const CompetitionMap = ({
  startPoint,
  finishPoint,
  polygon,
  centerOfLocation,
}) => {
  const flattedPolygon = polygon.flat();
  const boundingBox = flattedPolygon.reduce((acc, [latitude, longitude]) => {
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

  return (
    <MapView
      style={styles.map}
      region={{ ...centerOfLocation, latitudeDelta: latDelta, longitudeDelta: lngDelta }}
    >
      <Polygon
        coordinates={polygon.map((arrayOfMap) =>
          arrayOfMap.map((coordinates) => ({
            latitude: coordinates[LATITUDE_INDEX],
            longitude: coordinates[LONGITUDE_INDEX],
          })),
        ).flat()}
        strokeColor={COLORS.blueBackground}
        fillColor={COLORS.pink}
        strokeWidth={3}
      />
      <Marker
        coordinate={{
          latitude: startPoint.coordinates[LATITUDE_INDEX],
          longitude: startPoint.coordinates[LONGITUDE_INDEX],
        }}
        pinColor="#1bad04"
      />
      <Marker
        coordinate={{
          latitude: finishPoint.coordinates[LATITUDE_INDEX],
          longitude: finishPoint.coordinates[LONGITUDE_INDEX],
        }}
        pinColor="#ed4543"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 300,
    marginVertical: 15,
  },
  marker: {
    height: 20,
    width: 20,
  },
});

export default CompetitionMap;
