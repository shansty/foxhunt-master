import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import COLORS from '../../utils/constants/colors';

const ListContent = ({ title, value }) =>
  <View style={styles.descriptionBlock}>
    <Text style={styles.content}>{title}</Text>
    <Text style={styles.contentValue}>
      {value}
    </Text>
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
    opacity: 0.6,
    paddingTop: 5,
  },
});

export default ListContent;
