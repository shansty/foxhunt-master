import React from 'react';
import TextWithTooltip from '../../../parts/TextWithTooltip';
import { View } from 'react-native';
import GameSettingsRadio from './Radio';
import styles from './styles';

const GameSettingsSwitchItem = ({ textCode, item, competition, setValue }) => {
  const { key, title, data } = item;
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
        <View style={styles.innerSection}>
          <GameSettingsRadio
            options={data}
            setValue={handleChange}
            selectedOption={competition[key]}
          />
        </View>
      </TextWithTooltip>
    </View>
  );
};

export default GameSettingsSwitchItem;
