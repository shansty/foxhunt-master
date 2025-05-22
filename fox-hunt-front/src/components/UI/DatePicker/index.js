import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';

const DatePickerWidget = ({
  className,
  selected,
  calendarClassName,
  onChange,
  timeIntervals,
  minDate,
  minTime,
  maxTime,
  dateFormat,
}) => (
  <DatePicker
    className={`datepicker ${className}`}
    selected={selected}
    calendarClassName={calendarClassName}
    onChange={onChange}
    showTimeSelect
    timeIntervals={timeIntervals}
    minDate={minDate}
    maxTime={maxTime}
    minTime={minTime}
    dateFormat={dateFormat}
  />
);

DatePickerWidget.propTypes = {
  className: PropTypes.string,
  selected: PropTypes.object.isRequired,
  calendarClassName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  timeIntervals: PropTypes.number,
  minDate: PropTypes.object,
  minTime: PropTypes.object,
  maxTime: PropTypes.object,
  dateFormat: PropTypes.string,
};
export default DatePickerWidget;
