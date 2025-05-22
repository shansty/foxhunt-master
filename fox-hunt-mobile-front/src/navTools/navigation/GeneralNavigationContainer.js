import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ResolveAuthScreen from '../../screens/authentication/ResolveAuthScreen';
import BaseNavigator from './BaseNavigator';
import { Context as AuthContext } from '../../context/AuthContext';
import { navigationRef } from '../rootNavigation';
import { BASE, RESOLVE_AUTH } from '../../utils/constants/routeNames';
import { Context as CommonContext } from '../../context/CommonContext';

const Stack = createStackNavigator();

const GeneralNavigationContainer = () => {
  const { state } = useContext(AuthContext);
  const { setTooltips } = useContext(CommonContext);

  useEffect(() => {
    setTooltips();
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={RESOLVE_AUTH}
      >
        {state.isLoading ? <Stack.Screen name={RESOLVE_AUTH} component={ResolveAuthScreen} /> :
          <Stack.Screen name={BASE} component={BaseNavigator} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default GeneralNavigationContainer;
