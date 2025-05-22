import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Header from '../../components/parts/Header';
import COLORS from '../../utils/constants/colors';
import { CHANGE_PASSWORD_PAGE } from '../../utils/constants/routeNames';

const SettingsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        currentRoute="Settings"
        openDrawer={navigation.openDrawer}
      />
      <View>
        <View style={styles.buttonShell}>
          <Button
            buttonStyle={styles.submitButton}
            title="Change password"
            onPress={() => navigation.navigate(CHANGE_PASSWORD_PAGE)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 47,
    paddingHorizontal: 11.5,
    backgroundColor: COLORS.greyBackground,
  },
  buttonShell: {
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
  },
});

export default SettingsPage;
