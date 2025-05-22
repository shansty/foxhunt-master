import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tooltip as ElementsTooltip } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../utils/constants/colors';

const Tooltip = ({ message, width }) => {
  const [tooltipSize, setTooltipSize] = useState();

  return (
    <ElementsTooltip
      popover={
        <View
          onLayout={(event) => {
            setTooltipSize(event.nativeEvent.layout.height);
          }}
        >
          <Text style={styles.messageStyle}>
            {message}
          </Text>
        </View>
      }
      backgroundColor={COLORS.tooltipColor}
      height={tooltipSize}
      width={width}
      overlayColor='transparent'
      skipAndroidStatusBar={true}
    >
      <Ionicons
        name="help-circle-outline"
        style={styles.tooltipIcon}
      />
    </ElementsTooltip>
  );
};

const styles = StyleSheet.create({
  messageStyle: { color: COLORS.white, padding: 10 },
  tooltipIcon: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.7,
  },
});

export default Tooltip;
