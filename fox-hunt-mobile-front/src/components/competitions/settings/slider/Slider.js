import React from 'react';
import { Slider } from 'react-native-elements';
import COLORS from '../../../../utils/constants/colors';
import styles from './styles';

const GameSettingsSlider = ({ min, max, step, value, onChange }) => {
  return (
    <Slider
      style={styles.container}
      minimumValue={min}
      maximumValue={max}
      step={step}
      value={value}
      minimumTrackTintColor={COLORS.blueBackground}
      onValueChange={(value)=>onChange(value)}
      trackStyle={styles.track}
      thumbStyle={styles.thumb}
    />
  );
};

export default GameSettingsSlider;
