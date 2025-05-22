import React from 'react';
import COLORS from '../../../utils/constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const FoxPoints = React.memo(({ foxPoints }) => {
  return foxPoints.map((foxPoint, index) => {
    return (
      <View key={foxPoint.id} style={styles.foxes}>
        <Icon
          raised
          name={foxPoint.isFound ? 'check' : 'circle'}
          type='font-awesome'
          color={foxPoint.isFound ? COLORS.green : COLORS.red}
        />
        <Text style={styles.foxTitle}>Fox-{index + 1}</Text>
      </View>
    );
  });
},
);

FoxPoints.displayName = 'FoxPoints';

export const styles = StyleSheet.create({
  foxes: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  foxTitle: {
    color: COLORS.white,
  },
});

export default FoxPoints;
