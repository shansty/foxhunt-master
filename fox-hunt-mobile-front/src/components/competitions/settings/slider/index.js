import React from 'react';
import TextWithTooltip from '../../../parts/TextWithTooltip';
import { Text, View } from 'react-native';
import GameSettingsSlider from './Slider';
import styles from './styles';

const GameSettingsSlideItem = ({ textCode, item, competition, setValue }) => {
  const { key, title, valueLabel, settings: { min, max, step } } = item;
  const handleChange = (value)=>setValue({
    ...competition,
    [key]: value,
  });

  return (
    <View style={styles.section}>
      <TextWithTooltip
        message={title}
        textCode={textCode}
      >
        <View style={styles.row}>
          <GameSettingsSlider
            min={min}
            max={max}
            step={step}
            value={competition[key]}
            onChange={handleChange}
          />
          <Text style={styles.sliderValue}>{valueLabel}</Text>
        </View>
      </TextWithTooltip>
    </View>
  );
};

export default GameSettingsSlideItem;
