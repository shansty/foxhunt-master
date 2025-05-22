import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, DateTimePicker } from '@mui/lab';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import { FormikFormShape, FormikField } from './formikPropShapes';

const RESERVED_ERROR_SPACE = ' ';
const MASK_CHAR = '_';

const DatePickerField = ({
  field,
  form,
  format,
  fullWidth,
  keyBoardFormat,
  label,
  mask,
  placeholder,
  withTime,
  ...props
}) => {
  const onChange = (date, newValue) => {
    let newDate = date;
    if (isNaN(date) && newValue.search(/_/) < 0) {
      newDate = dayjs(newValue).format(keyBoardFormat);
    }
    form.setFieldValue(field.name, newDate, true);
  };

  const pickerProps = {
    error: !!form.errors[field.name],
    inputFormat: format,
    label,
    mask,
    maskChar: MASK_CHAR,
    onChange,
    placeholder,
    value: field.value,
    ...props,
    renderInput: (params) => (
      <TextField
        fullWidth={fullWidth}
        helperText={form.errors[field.name] || RESERVED_ERROR_SPACE}
        {...params}
      />
    ),
  };

  return withTime ? (
    <DateTimePicker {...pickerProps} />
  ) : (
    <DatePicker {...pickerProps} />
  );
};

DatePickerField.propTypes = {
  field: FormikField.isRequired,
  form: FormikFormShape.isRequired,
  format: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  keyBoardFormat: PropTypes.string.isRequired,
  label: PropTypes.string,
  mask: PropTypes.string,
  placeholder: PropTypes.string,
  withTime: PropTypes.bool,
};

DatePickerField.defaultProps = {
  fullWidth: false,
  label: '',
  placeholder: '',
  withTime: false,
};

export default DatePickerField;
