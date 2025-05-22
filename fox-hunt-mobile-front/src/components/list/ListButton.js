import { Image, StyleSheet } from 'react-native';
import React from 'react';

const ListButton = () =>
  <Image style={styles.icon} source={require('../../assets/button.png')} />;

const styles = StyleSheet.create({
  icon: {
    height: 7,
    width: 7,
    opacity: 0.8,
    marginRight: 5,
    marginTop: 4,
  },
});

export default ListButton;
