import React, { useContext, useEffect } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Context as CommonContext } from '../../context/CommonContext';
import Header from '../../components/parts/Header';
import COLORS from '../../utils/constants/colors';
import { HELP_DESCRIPTION_BLOCKS, HELP_PAGE } from '../../utils/constants/routeNames';
import { Icon } from 'react-native-elements';
import Spinner from '../../components/Spinner';
import { renderIcon, serialize, wrapInEditorObject } from '../../utils/commonUtils';
import HTML from 'react-native-render-html';
import { EDITOR_ELEMENT_STYLE } from '../../utils/constants/commonConstants';
import styles from './HelpPage.styles';
import { useFocusEffect } from '@react-navigation/native';
const HelpPage = ({ navigation }) => {
  const contentWidth = useWindowDimensions().width;
  const { state, setActiveTab, getHelpPagesDescription, changeIsLoading } =
  useContext(CommonContext);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      getHelpPagesDescription();
      return () => {
        changeIsLoading();
      };
    }, []),
  );

  useEffect(() => {
    if (isFocused) {
      setActiveTab(HELP_PAGE);
    }
  }, [isFocused]);

  return state.isLoading ? <Spinner /> :
    <View style={styles.container}>
      <Header
        currentRoute="Help"
        openDrawer={navigation.openDrawer}
      />
      <FlatList
        data={state.helpPages}
        style={styles.flatListStyle}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            navigation.navigate(HELP_DESCRIPTION_BLOCKS, item);
          }}>
            <View style={styles.item}>
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>
                  {item.title}
                </Text>
                {item.contents &&
                <HTML source={{ html: serialize(wrapInEditorObject(item.contents)) }}
                  contentWidth={contentWidth}
                  tagsStyles={EDITOR_ELEMENT_STYLE}/>}
              </View>
              <View style={styles.iconView}>
                <Icon
                  name={renderIcon(item.title)}
                  type='ionicon'
                  color={COLORS.lightGrey}
                  size={25}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>;
};

export default HelpPage;
