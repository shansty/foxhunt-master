import React from 'react';
import CountDown from 'react-native-countdown-component';
import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';
import { calculateRemainingTime } from '../../../utils/commonUtils';

const CustomCountdown = React.memo(({ actualStartDate, competitionDuration, onFinish }) => {
  return <CountDown
    size={20}
    until={calculateRemainingTime(actualStartDate, competitionDuration)}
    digitStyle={styles.countDownDigitStyle}
    digitTxtStyle={styles.countDownDigitTxtStyle}
    separatorStyle={styles.countDownSeparatorStyle}
    style={styles.countDown}
    timeToShow={['H', 'M', 'S']}
    timeLabels={{ m: null, s: null }}
    showSeparator
    onFinish={onFinish}
  />;
});

CustomCountdown.displayName = 'CustomCountdown';

const styles = StyleSheet.create({
  countDown: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  countDownDigitStyle: {
    backgroundColor: COLORS.lightBlack,
  },
  countDownDigitTxtStyle: {
    color: COLORS.white,
    fontSize: 20,
  },
  countDownSeparatorStyle: {
    color: COLORS.white,
    padding: 0,
  },
});

export default CustomCountdown;
