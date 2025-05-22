import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import COLORS from '../utils/constants/colors';

const Spinner = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.white} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.greyBackground,
    paddingHorizontal: 10,
  },
});

export default Spinner;
