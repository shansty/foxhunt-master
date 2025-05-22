import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button as ElementsButton } from 'react-native-elements';
import COLORS from '../../utils/constants/colors';
import Tooltip from './Tooltip';

const Button = ({
  title,
  backgroundColor,
  textColor,
  action,
  buttonCode,
  icon,
  isLoading,
}) => {
  return (
    <View style={[styles.container, buttonCode && { marginLeft: 30 }]}>
      <ElementsButton
        buttonStyle={[
          styles.submitButton,
          { backgroundColor },
          buttonCode && { marginRight: 10 },
        ]}
        containerStyle={{ flex: 1 }}
        titleStyle={{ color: textColor || COLORS.white, flex: 1 }}
        title={title}
        onPress={action}
        icon={icon}
        loading={isLoading}
      />
      {buttonCode &&
      <Tooltip message={buttonCode} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  submitButton: {
    borderRadius: 5,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },
});

export default Button;
