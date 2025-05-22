import React from 'react';
import { Text, View } from 'react-native';
import styles from './СardInfo.styles';
import { convertToDateFormat } from '../../../utils/commonUtils';
const CardInfo = ({ competition, startDate })=> {
  const { name, location } = competition;
  return (
    <View style={styles.cardInfoContainer}>
      <Text
        style={styles.nameText}>
        {name}
      </Text>
      <View
        style={styles.locationTextContainer}>
        <Text
          style={styles.locationText}>
          {location.name}
        </Text>
      </View>
      <View
        style={styles.startTextContainer}>
        <Text
          style={styles.timeText}>
          <Text style={styles.startText}>Start: </Text>
          {convertToDateFormat(startDate)}
        </Text>
      </View>
    </View>
  );
};

export default CardInfo;
