import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { Context as AuthContext } from '../../context/AuthContext';
import { AUTHENTICATION, HOME_PAGE } from '../../utils/constants/routeNames';

const Stack = createStackNavigator();

const BaseNavigator = () => {
  const { state: { isSignedIn } } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isSignedIn ? <Stack.Screen name={HOME_PAGE} component={MainNavigator} /> :
        <Stack.Screen name={AUTHENTICATION} component={AuthNavigator} />
      }
    </Stack.Navigator>
  );
};

export default BaseNavigator;
