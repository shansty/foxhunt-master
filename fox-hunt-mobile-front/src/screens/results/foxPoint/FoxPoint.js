import { Icon } from 'react-native-elements';
import { View } from 'react-native';
import React from 'react';
import { CHECK_POINT, CIRCLE_POINT } from '../resultConstants';
import COLORS from '../../../utils/constants/colors';

const FoxPoint = ({ isFound }) => {
  return (
    <View>
      <Icon
        raised
        name={isFound ? CHECK_POINT : CIRCLE_POINT}
        type='font-awesome'
        color={isFound ? COLORS.green : COLORS.red}
        size={7}
      />
    </View>
  );
};

export default FoxPoint;
