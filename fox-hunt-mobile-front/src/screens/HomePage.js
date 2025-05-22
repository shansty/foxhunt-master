import React, { useContext, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Context as CommonContext } from '../context/CommonContext';
import Header from '../components/parts/Header';
import COLORS from '../utils/constants/colors';
import WorldAnimation from '../animations/WorldAnimation';
import {
  SINGLE_COMPETITION_START,
  HOME_PAGE,
  HELP_PAGE,
} from '../utils/constants/routeNames';
import Button from '../components/parts/Button';
import DefaultTitle from '../components/parts/DefaultTitle';

const HomePage = ({ navigation }) => {
  const { setActiveTab, state: { tooltips } } = useContext(CommonContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  const toggleMessage = (toValue, duration) => {
    Animated.timing(fadeAnim, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isFocused) {
      setActiveTab(HOME_PAGE);
      toggleMessage(1, 1500);
    } else {
      toggleMessage(0, 0);
    }
  }, [isFocused]);

  const onHandlePress = () => {
    setActiveTab(SINGLE_COMPETITION_START);
    navigation.navigate(SINGLE_COMPETITION_START);
  };

  return (
    <View style={styles.container}>
      <Header
        currentRoute="Home"
        openDrawer={navigation.openDrawer}
      />
      <StatusBar backgroundColor={COLORS.headerBackground}/>
      <View style={styles.secondaryContainer}>
        <View>
          <WorldAnimation/>
        </View>
        <View>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.greetingTitle}>
              <Text style={styles.greetingText}>
                Welcome to
              </Text>
              <DefaultTitle titleCode={tooltips.HOME_TITLE} />
            </View>
            <Text style={styles.dataText}>
              You can participate in exciting competitions with your commands
              or create competition for yourself and play it at any time!
            </Text>
          </Animated.View>
          <View style={styles.buttonShell}>
            <Button
              title='TRY NOW'
              backgroundColor={COLORS.green}
              buttonCode={tooltips.HOME_TRY_NOW_BTN}
              action={onHandlePress}
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate(HELP_PAGE)}>
          <Text style={styles.advancedSettings}>Need some help?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.greyBackground,
  },
  secondaryContainer: { flexDirection: 'column', alignItems: 'center' },
  greetingTitle: { flexDirection: 'row', justifyContent: 'center' },
  greetingText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 23,
    marginLeft: 15,
    paddingBottom: 3,
    paddingRight: 7,
  },
  dataText: {
    color: COLORS.lightGrey,
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 50,
  },
  buttonShell: { marginVertical: 10, marginHorizontal: '15%' },
  buttonText: {
    fontSize: 18,
    paddingHorizontal: 15,
    color: COLORS.white,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.green,
    padding: 10,
    borderRadius: 5,
  },
  advancedSettings: {
    color: COLORS.grey,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
});

export default HomePage;
