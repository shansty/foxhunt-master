import React from 'react';
import CircularPicker from 'react-native-circular-picker';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../utils/constants/colors';

const CustomCircularPicker = React.memo(({ title, value, handleChange, defaultPos }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <CircularPicker
      size={140}
      strokeWidth={20}
      gradients={{ 0: [COLORS.lightGrey, COLORS.grey] }}
      defaultPos={defaultPos ? defaultPos : 0}
      onChange={handleChange}
    >
      <Text style={styles.value}>{value}</Text>
    </CircularPicker>
  </View>
),
);

const styles = StyleSheet.create({
  value: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 7,
    color: COLORS.white,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    color: COLORS.white,
    marginVertical: 7,
    fontSize: 17,
  },
});

// fix eslint error 'react/display-name'
CustomCircularPicker.displayName = 'CustomCircularPicker';

export default CustomCircularPicker;
