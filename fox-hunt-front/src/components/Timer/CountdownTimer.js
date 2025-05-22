import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';

import { CountdownTimerCircle } from './CountdownTimerCircle';
import useInterval from 'src/hooks/useInterval';
import useGetTimerState from './useGetTimerState';
import { DATE_FORMATS } from 'src/constants/dateFormatConstants';

dayjs.extend(utc);

export const CountdownTimer = ({
  bottomLabel,
  displayTopLabel,
  initValue,
  timerInterval,
  timerSubtraction,
  topLabel,
  totalValue,
  warningColorPercentage,
}) => {
  const {
    currentBottomLabel,
    currentTopLabel,
    currentValue,
    dispatch,
    isWarningColor,
    negativeCurrentValueType,
    positiveCurrentValueType,
    proportion,
  } = useGetTimerState(initValue, topLabel, bottomLabel);

  useInterval(() => {
    const substractedValue = currentValue - timerSubtraction;
    dispatch({
      type: positiveCurrentValueType,
      payload: {
        currentValue: substractedValue,
        isWarningColor: substractedValue < totalValue * warningColorPercentage,
        proportion: substractedValue / totalValue,
      },
    });
    if (currentValue <= 0) {
      dispatch({
        type: negativeCurrentValueType,
        payload: {
          currentBottomLabel: bottomLabel,
          currentTopLabel: topLabel,
          currentValue: initValue,
          isWarningColor: false,
          proportion: initValue,
        },
      });
    }
  }, timerInterval);

  return (
    <div draggable="true">
      {initValue && (
        <CountdownTimerCircle
          bottomLabel={currentBottomLabel}
          displayTopLabel={displayTopLabel}
          isWarningColor={isWarningColor}
          proportion={proportion}
          timeDisplay={dayjs
            .unix(currentValue)
            .utc()
            .format(DATE_FORMATS.TIME_COMMON_DISPLAY)}
          topLabel={currentTopLabel}
        />
      )}
    </div>
  );
};

CountdownTimer.propTypes = {
  bottomLabel: PropTypes.string.isRequired,
  displayTopLabel: PropTypes.bool.isRequired,
  initValue: PropTypes.number.isRequired,
  timerInterval: PropTypes.number.isRequired,
  timerSubtraction: PropTypes.number.isRequired,
  topLabel: PropTypes.string,
  totalValue: PropTypes.number.isRequired,
};
