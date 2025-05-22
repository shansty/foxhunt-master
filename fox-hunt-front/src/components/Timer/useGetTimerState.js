import { useReducer } from 'react';

export default function useGetTimerState(initValue, topLabel, bottomLabel) {
  const initialState = {
    currentValue: initValue,
    proportion: null,
    isWarningColor: false,
    currentTopLabel: topLabel,
    currentBottomLabel: bottomLabel,
  };

  const positiveCurrentValueType = 'positiveCurrentValue';
  const negativeCurrentValueType = 'negativeCurrentValue';

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case positiveCurrentValueType:
        return {
          ...state,
          currentValue: payload.currentValue,
          proportion: payload.proportion,
          isWarningColor: payload.isWarningColor,
        };
      case negativeCurrentValueType:
        return {
          ...state,
          currentValue: payload.currentValue,
          proportion: payload.proportion,
          isWarningColor: payload.isWarningColor,
          currentTopLabel: payload.currentTopLabel,
          currentBottomLabel: payload.currentBottomLabel,
        };
      default:
        return state;
    }
  };
  const [
    {
      currentValue,
      proportion,
      isWarningColor,
      currentTopLabel,
      currentBottomLabel,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return {
    currentValue,
    proportion,
    isWarningColor,
    currentTopLabel,
    currentBottomLabel,
    positiveCurrentValueType,
    negativeCurrentValueType,
    dispatch,
  };
}
