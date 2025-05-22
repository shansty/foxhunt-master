import React from 'react';
import COLORS from '../../../../utils/constants/colors';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';

const GameSettingsRadio = ({ options, selectedOption, setValue }) => {
  return (
    <View style={styles.container}>
      {options.map((option)=>(
        <TouchableOpacity
          key={option.label}
          onPress={()=>setValue(option.value)}
          style={{
            ...styles.choice,
            backgroundColor: selectedOption === option.value ? COLORS.blueBackground : null,
          }}
        >
          <Text style={styles.choiceText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default GameSettingsRadio;
