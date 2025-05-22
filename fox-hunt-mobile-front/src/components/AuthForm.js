import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DefaultTitle from './parts/DefaultTitle';
import COLORS from '../utils/constants/colors';
import Input from '../components/parts/Input';
import Button from '../components/parts/Button';
import { Context as CommonContext } from '../context/CommonContext';

const AuthForm = ({
  headerText,
  errorMessage,
  signInWithEmail,
  submitButtonText,
  currentDomain,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state: { tooltips } } = useContext(CommonContext);

  const onSubmit = () => {
    signInWithEmail(email, password, currentDomain);
  };

  return (
    <View style={styles.container}>
      <DefaultTitle
        title={headerText}
        titleCode={tooltips.SIGN_IN_WITH_EMAIL_AND_PASS_TITLE}
        centered={true}
      />
      <Input
        label='Email'
        value={email}
        onChangeText={setEmail}
        leftIconName="mail-outline"
        inputCode={tooltips.AUTHENTICATION_EMAIL_INPUT}
      />
      <Input
        secureTextEntry={true}
        label='Password'
        value={password}
        onChangeText={setPassword}
        leftIconName="key-outline"
        inputCode={tooltips.AUTHENTICATION_PASSWORD_INPUT}
      />
      {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <Button
        title={submitButtonText}
        backgroundColor={COLORS.blueBackground}
        buttonCode={tooltips.SIGN_IN_WITH_EMAIL_AND_PASS_BTN}
        action={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: COLORS.blueBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  inputStyle: {
    color: COLORS.white,
    fontSize: 15,
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
  inputLabelStyle: {
    color: COLORS.white,
    opacity: 0.9,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 15,
    marginTop: -15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    marginHorizontal: 10,
    color: '#000',
  },
});

export default AuthForm;
