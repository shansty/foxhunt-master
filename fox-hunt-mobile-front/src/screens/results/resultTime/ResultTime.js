import React from 'react';
import { Text, View } from 'react-native';
import styles from './ResultTime.styles';

const ResultTime = ({ time }) => {
  return (
    <View
      style={styles.timeContainer}>
      <Text
        style={styles.timeText}>
        {time}
      </Text>
    </View>
  );
};

export default ResultTime;
