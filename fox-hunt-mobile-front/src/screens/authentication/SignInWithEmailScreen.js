import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AuthForm from '../../components/AuthForm';
import { Context as AuthContext } from '../../context/AuthContext';
import COLORS from '../../utils/constants/colors';

const SignInWithEmailScreen = ({ navigation }) => {
  const { state, signInWithEmail, clearErrorMessage } = useContext(
    AuthContext,
  );

  useEffect(() => {
    return navigation.addListener('focus', () => {
      clearErrorMessage();
    });
  }, []);

  return (
    <View style={styles.container}>
      <AuthForm
        headerText="Sign In to Your Account"
        errorMessage={state.errorMessage}
        signInWithEmail={signInWithEmail}
        submitButtonText="Sign In"
        currentDomain={state.currentDomain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyBackground,
    justifyContent: 'center',
  },
});

export default SignInWithEmailScreen;
