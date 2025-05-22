import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import Header from '../../components/parts/Header';
import COLORS from '../../utils/constants/colors';
import { Context as AuthContext } from '../../context/AuthContext';
import { SETTINGS_PAGE } from '../../utils/constants/routeNames';
import Input from '../../components/parts/Input';
import Button from '../../components/parts/Button';
import { Context as CommonContext } from '../../context/CommonContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import styles from './ChangePasswordPage.styles';

const ChangePasswordPage = ({ navigation }) => {
  const { state, updatePassword, setError, clearErrorMessage } = useContext(AuthContext);
  const { state: { tooltips } } = useContext(CommonContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    return () => clearErrorMessage();
  }, []);

  const changePassword = async () => {
    try {
      await updatePassword(oldPassword, newPassword, confirmNewPassword);
      Alert.alert(
        'Password successfully changed',
        '',
        [
          {
            text: 'Ok',
            onPress: () => navigation.navigate(SETTINGS_PAGE),
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        currentRoute="Change password"
        openDrawer={navigation.openDrawer}
      />
      <KeyboardAwareScrollView>
        <View style={styles.inputsBlock}>
          <Input
            secureTextEntry={true}
            label='Old password'
            value={oldPassword}
            onChangeText={setOldPassword}
            inputCode={tooltips.CHANGE_PASSWORD_OLD_INPUT}
          />
          <Input
            secureTextEntry={true}
            label='New password'
            value={newPassword}
            onChangeText={setNewPassword}
            inputCode={tooltips.CHANGE_PASSWORD_NEW_INPUT}
          />
          <Input
            secureTextEntry={true}
            label='Confirm new password'
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            inputCode={tooltips.CHANGE_PASSWORD_CONFIRM_NEW_INPUT}
          />
          {!!state.errorMessage && <Text style={styles.errorMessage}>{state.errorMessage}</Text>}
          <Button
            title='Change password'
            backgroundColor={COLORS.blueBackground}
            buttonCode={tooltips.CHANGE_PASSWORD_BTN}
            action={changePassword}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChangePasswordPage;
