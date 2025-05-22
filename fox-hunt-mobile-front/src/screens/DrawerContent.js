import React, { useContext } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import COLORS from '../utils/constants/colors';
import DefaultTitle from '../components/parts/DefaultTitle';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as CommonContext } from '../context/CommonContext';
import { lowerMenuItems, topMenuItems } from './drawerItemConstants';
import styles from './DrawerContent.styles';

const DrawerContent = (props) => {
  const { signOut } = useContext(AuthContext);
  const { state: { activeTab, tooltips }, setActiveTab } = useContext(CommonContext);
  const { navigation } = props;

  const handleClick = (routeName) => {
    setActiveTab(routeName);
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <DefaultTitle titleCode={tooltips.DRAWER_TITLE} />
      <DrawerContentScrollView {...props}>
        {topMenuItems.map((item, index)=>(
          <DrawerItem
            key={index}
            icon={() => <Ionicons name={item.icon} style={styles.drawerIcon} />}
            label={item.label}
            focused={activeTab === item.route}
            activeTintColor={COLORS.white}
            inactiveTintColor={COLORS.grey}
            activeBackgroundColor={COLORS.blueBackground}
            inactiveBackgroundColor={COLORS.lightBlack}
            onPress={() => handleClick(item.route)}
          />

        ))}
      </DrawerContentScrollView>
      <DrawerContentScrollView contentContainerStyle={styles.helpBlock} {...props}>
        {lowerMenuItems.map((item, index)=>(
          <DrawerItem
            key={index}
            icon={() => <Ionicons name={item.icon} style={styles.drawerIcon} />}
            label={item.label}
            focused={activeTab === item.route}
            activeTintColor={COLORS.white}
            inactiveTintColor={COLORS.grey}
            activeBackgroundColor={COLORS.blueBackground}
            inactiveBackgroundColor={COLORS.lightBlack}
            onPress={() => handleClick(item.route)}
          />
        ))}
      </DrawerContentScrollView>
      <DrawerItem
        icon={() => <Ionicons name="log-out-outline" style={styles.drawerIcon} />}
        label="Sign Out"
        inactiveTintColor={COLORS.grey}
        onPress={signOut}
      />
    </View>
  );
};


export default DrawerContent;
