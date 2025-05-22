import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Input as ElementsInput } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../utils/constants/colors';
import Tooltip from './Tooltip';

const Input = ({
  label,
  value,
  onChangeText,
  leftIconName,
  inputCode,
  secureTextEntry,
}) => {
  const [isPasswordHiddenToggle, setIsPasswordHiddenToggle] = useState(true);


  return (
    <View style={styles.container}>
      <ElementsInput
        containerStyle={{ flex: 1 }}
        secureTextEntry={secureTextEntry ? isPasswordHiddenToggle : false}
        label={label}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        labelStyle={styles.inputLabelStyle}
        leftIcon={leftIconName && <Ionicons name={leftIconName} style={styles.inputLeftIcon} />}
        rightIcon={
          <View style={{ flexDirection: 'row' }}>
            {secureTextEntry && (
              <TouchableOpacity onPress={() => setIsPasswordHiddenToggle(!isPasswordHiddenToggle)}>
                {isPasswordHiddenToggle ?
                  <Ionicons
                    name="md-eye-off"
                    style={styles.inputRightIcon}
                  /> :
                  <Ionicons name="md-eye" style={styles.inputRightIcon} />
                }
              </TouchableOpacity>
            )}
            {inputCode &&
              <View style={{ paddingLeft: 10 }}>
                <Tooltip message={inputCode} />
              </View>
            }
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: COLORS.blueBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    // marginHorizontal: 10,
    marginTop: 5,
  },
  inputStyle: {
    color: COLORS.white,
    fontSize: 15,
  },
  inputLabelStyle: {
    color: COLORS.white,
    opacity: 0.9,
  },
  inputLeftIcon: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.7,
    paddingRight: 7,
    marginRight: 5,
    borderRightColor: COLORS.blueBackground,
    borderRightWidth: 1,
  },
  inputRightIcon: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.7,
  },
});

export default Input;
