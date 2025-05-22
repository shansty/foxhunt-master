import React from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { capitalizeFirstLetter } from '../../utils/commonUtils';
import styles from './Header.styles';

const Header = ({ currentRoute, openDrawer }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.menuContainer} onPress={() => {
      openDrawer(); Keyboard.dismiss();
    }}>
      <Ionicons name="menu-outline" style={styles.menu} />
    </TouchableOpacity>
    <Text numberOfLines={1} style={styles.routeName}>
      {capitalizeFirstLetter(currentRoute)}
    </Text>
  </View>
);

export default Header;
