import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import COLORS from '../../../../utils/constants/colors';
import { View } from 'react-native';
import TextWithTooltip from '../../../parts/TextWithTooltip';
import styles from './styles';

const GameSettingsCheckboxItem = ({ textCode, item, competition, setValue }) => {
  const { key, title } = item;
  const handleChange = () => setValue({
    ...competition,
    [key]: !competition[key],
  });

  return (
    <View style={[styles.section, styles.sectionWithCheckbox]}>
      <CheckBox
        value={competition[key]}
        onValueChange={handleChange}
        tintColors={{ true: COLORS.white }}
      />
      <View style={styles.checkBoxLabel}>
        <TextWithTooltip
          message={title}
          textCode={textCode}
        />
      </View>
    </View>
  );
};

export default GameSettingsCheckboxItem;
