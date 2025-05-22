import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './CountdownTimerCircle.scss';

export const CountdownTimerCircle = (props) => {
  const mainSize = 110;
  const strokeWidth = 6;
  const {
    proportion,
    timeDisplay,
    isWarningColor,
    displayTopLabel,
    topLabel,
    bottomLabel,
  } = props;
  const radius = (mainSize - strokeWidth) / 2;
  const dashArray = radius * 2 * Math.PI;
  const dashOffset = dashArray - dashArray * (100 - proportion || 0);

  return (
    <Fragment>
      <svg
        width={mainSize}
        height={mainSize}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <circle
          className="timer-background"
          cx={mainSize / 2}
          cy={mainSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className="progress"
          cx={mainSize / 2}
          cy={mainSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${mainSize / 2} ${mainSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
        <text
          className="txt-status"
          x="50%"
          y="30%"
          dy=".2em"
          textAnchor="middle"
        >
          {!!proportion && displayTopLabel && topLabel}
        </text>
        <text
          className={`timer ${isWarningColor ? 'warn' : ''}`}
          x="50%"
          y="50%"
          dy=".2em"
          textAnchor="middle"
        >
          {`${timeDisplay}`}
        </text>
        <text
          className="txt-status"
          x="50%"
          y="70%"
          dy=".2em"
          textAnchor="middle"
        >
          {!displayTopLabel && bottomLabel}
        </text>
      </svg>
    </Fragment>
  );
};

CountdownTimerCircle.propTypes = {
  proportion: PropTypes.number.isRequired,
  timeDisplay: PropTypes.string.isRequired,
  bottomLabel: PropTypes.string.isRequired,
  topLabel: PropTypes.string,
  isWarningColor: PropTypes.bool.isRequired,
  displayTopLabel: PropTypes.bool.isRequired,
};
