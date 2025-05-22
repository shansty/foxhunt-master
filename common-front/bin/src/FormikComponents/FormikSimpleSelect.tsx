import React from 'react';
import { FieldAttributes } from 'formik';
import { TextField } from 'formik-mui';
import { MenuItem } from '@mui/material';

export function FormikSimpleSelect({
  items,
  menuItemProps = {},
  ...props
}: FieldAttributes<any>) {
  const name = props.field.name;

  return (
    <TextField name={name} select {...props}>
      {items.map((item: any) => (
        <MenuItem
          key={item.value ? item.value + item.label : item}
          value={item.value ? item.value : item}
          {...menuItemProps}
        >
          {item.label ? item.label : item}
        </MenuItem>
      ))}
    </TextField>
  );
}
