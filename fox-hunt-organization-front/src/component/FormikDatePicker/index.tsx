import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const RESERVED_ERROR_SPACE = ' ';

interface DatePickerProps {
  field: any;
  form: any;
  format: string;
  fullWidth: boolean;
  keyBoardFormat: string;
  label: string;
  mask: string;
  placeholder: string;
}

const DatePickerField = ({
  field,
  form,
  format,
  fullWidth,
  keyBoardFormat,
  label,
  mask,
  placeholder,
  ...props
}: DatePickerProps) => {
  const handleChange = (date: string | null) => {
    form.setFieldValue(field.name, date, true);
  };
  const renderInput = (params: TextFieldProps) => (
    <TextField
      fullWidth={fullWidth}
      helperText={form.errors[field.name] || RESERVED_ERROR_SPACE}
      {...params}
    />
  );
  return (
    <DatePicker
      label={label}
      inputFormat={format}
      value={field.value || null}
      onChange={handleChange}
      renderInput={renderInput}
      {...props}
    />
  );
};

export default DatePickerField;
