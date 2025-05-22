import React from 'react';
import { FieldAttributes } from 'formik';
import { Autocomplete } from 'formik-mui';
import { makeStyles } from '@mui/styles';
import { TextField } from '@mui/material';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

export function FormikSimpleAutocomplete({
  options,
  textInputProps,
  ...props
}: FieldAttributes<any>) {
  const classes = useStyles();
  const { error, field, form, helperText, meta, ...otherProps } = props;
  const formikProps = { field, meta, form };
  const { name } = field;
  const getOptionLabel = (option: any) => option;
  const isOptionEqualToValue = (option: any, value: any) =>
    option.id === value.id;

  return (
    <Autocomplete
      autoHighlight
      blurOnSelect
      classes={{ option: classes.option }}
      getOptionLabel={getOptionLabel}
      name={name}
      options={options}
      isOptionEqualToValue={isOptionEqualToValue}
      {...formikProps}
      {...otherProps}
      renderInput={(params: any) => (
        <TextField
          error={error}
          helperText={helperText}
          inputProps={{ ...params.inputProps }}
          {...params}
          {...textInputProps}
        />
      )}
    />
  );
}
