import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../components/parts/Header';
import COLORS from '../../utils/constants/colors';
import HelpFlatlist from '../../components/HelpFlatlist';

const HelpDescriptionBlocks = ({ route, navigation }) => {
  const item = route.params;
  return (
    <View style={styles.container}>
      <Header
        currentRoute={item.title}
        openDrawer={navigation.openDrawer}
      />
      <HelpFlatlist renderData={item.articles} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyBackground,
  },
});

export default HelpDescriptionBlocks;
