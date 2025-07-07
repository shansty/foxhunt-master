import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, Grid, styled } from '@mui/material';
import { FormikInput, FormikSimpleSelect } from 'common-front';
import { TextField } from 'formik-mui';
import {
  TooltipShape,
  SelectPropsShape,
  TooltipCodeShape,
} from '../propShapes';
import { StyledGrid } from '../styles';

function TooltipMobileFormInputs({
  handleChange,
  SelectProps,
  tooltip,
  selectItems,
}) {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    width: '40%',
    [theme.breakpoints.down('sm')]: {
      width: '65%',
      wordBreak: 'break-all',
    },
  }));

  return (
    <StyledTableCell align="left">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
      >
        <StyledGrid item xs>
          <FormikInput
            fullWidth
            enableFeedback
            component={FormikSimpleSelect}
            name="code"
            label="Code*"
            variant="outlined"
            items={selectItems}
            menuItemProps={{
              sx: { wordBreak: 'break-all', whiteSpace: 'normal' },
            }}
            onChange={handleChange}
            disabled={!!tooltip?.code}
            SelectProps={SelectProps}
          />
        </StyledGrid>
        <StyledGrid item xs>
          <FormikInput
            fullWidth
            multiline
            enableFeedback
            component={TextField}
            name="message"
            label="Message*"
            variant="outlined"
            onChange={handleChange}
          />
        </StyledGrid>
      </Grid>
    </StyledTableCell>
  );
}

TooltipMobileFormInputs.propsTypes = {
  handleChange: PropTypes.func.isRequired,
  SelectProps: SelectPropsShape.isRequired,
  tooltip: TooltipShape,
  selectItems: PropTypes.arrayOf(TooltipCodeShape).isRequired,
};

TooltipMobileFormInputs.defaultProps = {
  tooltip: null,
};

export default TooltipMobileFormInputs;
