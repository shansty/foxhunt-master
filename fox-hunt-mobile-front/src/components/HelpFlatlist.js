import React from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import COLORS from '../utils/constants/colors';
import HTML from 'react-native-render-html';
import { serialize, wrapInEditorObject } from '../utils/commonUtils';
import { EDITOR_ELEMENT_STYLE } from '../utils/constants/commonConstants';

const HelpFlatlist = ({ renderData }) => {
  const contentWidth = useWindowDimensions().width;
  return (<FlatList
    data={renderData}
    style={{ marginTop: 50 }}
    keyExtractor={(item) => item.title}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>
          {item.title}
        </Text>
        <View style={styles.itemDescription}>
          <HTML source={{ html: item && serialize(wrapInEditorObject(item.contents)) }}
            contentWidth={contentWidth}
            tagsStyles={EDITOR_ELEMENT_STYLE}
          />
        </View>
      </View>
    )}
  />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.greyBackground,
  },
  item: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.blueBackground,
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 5,
  },
  itemDescription: {
    color: COLORS.lightGrey,
    fontSize: 15,
    fontWeight: '100',
    textAlign: 'justify',
  },
});

export default HelpFlatlist;
