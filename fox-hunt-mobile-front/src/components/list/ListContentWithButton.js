import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ListButton from './ListButton';
import COLORS from '../../utils/constants/colors';

const ListContentWithButton = ({ title, value }) =>
  <View style={styles.descriptionBlock}>
    <View style={styles.contentContainer}>
      <ListButton />
      <Text style={styles.content}>{title}</Text>
    </View>
    <Text style={styles.contentValue}>{value}</Text>
  </View>;

const styles = StyleSheet.create({
  descriptionBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    color: COLORS.white,
    opacity: 0.8,
    paddingTop: 5,
  },
  contentValue: {
    color: COLORS.white,
    opacity: 0.8,
    paddingTop: 5,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ListContentWithButton;
