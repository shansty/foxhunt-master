import style from './RangeSlider.module.scss';
import React, { useRef, useState } from 'react';
import { Overlay } from 'react-bootstrap';
import Tooltip from '../Tooltip/Tooltip';
import PropTypes from 'prop-types';

const RangeSlider = ({
  id,
  min,
  max,
  step,
  value,
  onChange,
  tooltipPosition,
  tooltipLabel,
  styles,
  disabled,
}) => {
  const [displayTooltip, setDisplayTooltip] = useState(false);
  const inputRef = useRef(null);

  const getThumbWidth = () => {
    const { thumbWidth } = style;
    if (typeof thumbWidth === 'string' && thumbWidth.includes('px')) {
      return +thumbWidth.substring(0, thumbWidth.indexOf('px'));
    }
    return 16;
  };

  const calculateTooltipLeftOffset = () => {
    const rangeMiddle = min + ((max - min) >> 1);
    if (value === rangeMiddle || inputRef.current === null) {
      return 0;
    }
    // target.current.offsetWidth;
    const trackWidth = inputRef.current.getBoundingClientRect().width;
    // set this to the pixel width of the thumb. Must be the same as $thumbWidth
    const thumbWidth = getThumbWidth();
    // placement percentage between left and right of input
    const thumbPosition = (value - min) / (max - min);
    // position the tooltip with the thumb
    const thumbCorrection = thumbWidth * (thumbPosition - 0.3) * -1;
    // tooltip at the beginning of input range
    const startPosition = Math.round((trackWidth >> 1) - (thumbWidth >> 1));
    const tooltipOffset = Math.round(
      thumbPosition * trackWidth - (thumbWidth >> 2) + thumbCorrection,
    );
    const tooltipPosition = startPosition - tooltipOffset;
    // move to the left or right of center point
    return -tooltipPosition;
  };

  return (
    <div className={'range-slider-container'} style={styles.root}>
      <span className={'slider-item'} style={styles.startSpan}>
        {min}
      </span>
      <input
        id={id}
        type="range"
        className={'custom-range slider-item'}
        style={styles.input}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        ref={inputRef}
        onMouseDown={() => setDisplayTooltip(true)}
        onClick={() => setDisplayTooltip(false)}
        disabled={disabled}
      />
      <Overlay
        target={inputRef.current}
        show={displayTooltip}
        placement={tooltipPosition}
      >
        {({ style, ...props }) => (
          <Tooltip
            id={`overlay-${id}`}
            style={{ ...style, left: calculateTooltipLeftOffset() }}
            {...props}
          >
            {tooltipLabel || value}
          </Tooltip>
        )}
      </Overlay>
      <span className={'slider-item'} style={styles.finishSpan}>
        {max}
      </span>
    </div>
  );
};

RangeSlider.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  tooltipPosition: PropTypes.oneOf(['top', 'bottom']),
  tooltipLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
};

RangeSlider.defaultProps = {
  id: 'range-slider',
  min: 0,
  max: 10,
  step: 1,
  tooltipPosition: 'top',
};

export default RangeSlider;
