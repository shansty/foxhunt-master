import React, { Fragment } from 'react';
import { FormControl } from 'react-bootstrap';

export const formField = ({
  input,
  placeholder,
  type,
  as,
  rows,
  meta: { touched, error, warning },
}) => (
  <Fragment>
    <FormControl
      {...input}
      placeholder={placeholder}
      type={type}
      as={as}
      rows={rows}
    />

    {touched &&
      ((error && <span className="text-danger">{error}</span>) ||
        (warning && <span>{warning}</span>))}
  </Fragment>
);
