import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CHANGE_PASSWORD_PAGE, HOME_PAGE } from '../../utils/constants/routeNames';
import DrawerContent from '../../screens/DrawerContent';
import { Context as AuthContext } from '../../context/AuthContext';
import { screens } from '../navigationConstants';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  const { state } = useContext(AuthContext);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props}/>}
      initialRouteName={state.isUserActivated ? HOME_PAGE : CHANGE_PASSWORD_PAGE}
    >
      {screens.map((screen, index) =>
        <Drawer.Screen
          key={index}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />,
      )}
    </Drawer.Navigator>
  );
};
export default MainDrawer;
