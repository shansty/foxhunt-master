import React, { useContext, useEffect } from 'react';
import { Image, Keyboard, StyleSheet, Text, View } from 'react-native';
import DefaultTitle from '../../components/parts/DefaultTitle';
import { Context as AuthContext } from '../../context/AuthContext';
import { SIGN_IN_WITH_EMAIL } from '../../utils/constants/routeNames';
import Button from '../../components/parts/Button';
import COLORS from '../../utils/constants/colors';
import { Context as CommonContext } from '../../context/CommonContext';

const SignInScreen = ({ navigation }) => {
  const { state, signInWithGoogle, clearErrorMessage } = useContext(
    AuthContext,
  );
  const { state: { tooltips } } = useContext(CommonContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearErrorMessage();
    });
    Keyboard.dismiss();

    return unsubscribe;
  }, []);

  const goToSignInWithEmail = () => {
    navigation.navigate(SIGN_IN_WITH_EMAIL);
  };

  const onGoogleAuth = () => {
    signInWithGoogle(state.currentDomain);
  };

  return (
    <View style={styles.mainContainer}>
      <DefaultTitle
        title="How do you want to sign in?"
        titleCode={tooltips.SIGN_IN_OPTIONS_TITLE}
        centered={true}
      />
      <Button
        title='Sign in with Email'
        backgroundColor={COLORS.blueBackground}
        buttonCode={tooltips.GO_TO_SIGN_IN_PAGE_USING_EMAIL_BTN}
        action={goToSignInWithEmail}
      />
      <View style={styles.separatorContainer}>
        <View style={styles.horizontalLine} />
        <View>
          <Text style={styles.separatorValue}>or</Text>
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <Button
        title='Sign in with Google'
        backgroundColor={COLORS.white}
        textColor={COLORS.black}
        buttonCode={tooltips.SIGN_IN_WITH_GOOGLE_BTN}
        action={onGoogleAuth}
        icon={<Image style={styles.tinyLogo} source={require('../../assets/search.png')} />}
      />
      {!!state.errorMessage && <Text style={styles.errorMessage}>{state.errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.greyBackground,
    paddingHorizontal: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.white,
    opacity: 0.7,
  },
  separatorValue: {
    width: 50,
    textAlign: 'center',
    color: COLORS.white,
    opacity: 0.7,
  },
  tinyLogo: {
    width: 15,
    height: 15,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 10,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignInScreen;
