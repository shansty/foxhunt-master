import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../../utils/constants/colors';
import Tooltip from './Tooltip';

const TextWithTooltip = ({ message, textCode, children }) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pickerLabel}>{message}</Text>
        {textCode && (
          <View style={styles.tooltipContainer}>
            <Tooltip message={textCode} />
          </View>
        )}
      </View>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  pickerLabel: {
    color: COLORS.white,
    fontSize: 15,
    paddingBottom: 5,
    paddingRight: 5,
    marginLeft: 10,
  },
  tooltipContainer: { marginTop: 0.5 },
});

export default TextWithTooltip;
