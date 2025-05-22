import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInWithEmailScreen
  from '../../screens/authentication/SignInWithEmailScreen';
import DomainScreen from '../../screens/authentication/DomainScreen';
import SignInOptionsScreen
  from '../../screens/authentication/SignInOptionsScreen';
import {
  DOMAIN,
  SIGN_IN_OPTIONS,
  SIGN_IN_WITH_EMAIL,
} from '../../utils/constants/routeNames';
import { Context as CommonContext } from '../../context/CommonContext';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { setTooltips } = useContext(CommonContext);

  useEffect(() => {
    setTooltips();
  }, []);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={DOMAIN} component={DomainScreen} />
      <Stack.Screen name={SIGN_IN_OPTIONS} component={SignInOptionsScreen} />
      <Stack.Screen name={SIGN_IN_WITH_EMAIL} component={SignInWithEmailScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
