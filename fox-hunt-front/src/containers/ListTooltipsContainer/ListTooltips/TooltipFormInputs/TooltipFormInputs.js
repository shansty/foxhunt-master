import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
import { FormikInput, FormikSimpleSelect } from 'common-front';
import { TextField } from 'formik-mui';
import { CodeCell } from '../styles';
import {
  TooltipShape,
  SelectPropsShape,
  TooltipCodeShape,
} from '../propShapes';

function TooltipFormInputs({
  handleChange,
  SelectProps,
  tooltip,
  selectItems,
}) {
  return (
    <>
      <CodeCell align="left">
        <FormikInput
          fullWidth
          enableFeedback
          component={FormikSimpleSelect}
          name="code"
          id="tooltipCode"
          label="Code*"
          variant="outlined"
          items={selectItems}
          onChange={handleChange}
          disabled={!!tooltip?.code}
          SelectProps={SelectProps}
        />
      </CodeCell>
      <TableCell align="left" sx={{ width: '35%' }}>
        <FormikInput
          enableFeedback
          fullWidth
          multiline
          component={TextField}
          name="message"
          id="messageCode"
          label="Message*"
          variant="outlined"
          onChange={handleChange}
        />
      </TableCell>
    </>
  );
}

TooltipFormInputs.propsTypes = {
  handleChange: PropTypes.func.isRequired,
  SelectProps: SelectPropsShape.isRequired,
  tooltip: TooltipShape,
  selectItems: PropTypes.arrayOf(TooltipCodeShape).isRequired,
};

TooltipFormInputs.defaultProps = {
  tooltip: null,
};

export default TooltipFormInputs;
