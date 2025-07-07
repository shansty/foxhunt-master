import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow, Grid } from '@mui/material';
import { DropdownMenu, useIsMobile } from 'common-front';
import { TooltipShape } from '../propShapes';
import { ActionCell, CodeCell, StyledGrid } from '../styles';

function TooltipTableRow({ tooltip, index, getActionItems }) {
  const isMobile = useIsMobile();

  return (
    <TableRow>
      <TableCell scope="row" align="left" sx={{ width: '5%' }}>
        {++index}
      </TableCell>
      {isMobile ? (
        <CodeCell align="left">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
          >
            <StyledGrid xs item>
              {tooltip.code}
            </StyledGrid>
            <StyledGrid xs item>
              {tooltip.message}
            </StyledGrid>
          </Grid>
        </CodeCell>
      ) : (
        <>
          <CodeCell align="left">{tooltip.code}</CodeCell>
          <TableCell align="left" sx={{ width: '35%' }}>
            {tooltip.message}
          </TableCell>
        </>
      )}
      <ActionCell align="left">
        <DropdownMenu items={getActionItems(tooltip)} />
      </ActionCell>
    </TableRow>
  );
}

TooltipTableRow.propTypes = {
  tooltip: TooltipShape,
  index: PropTypes.number.isRequired,
  getActionItems: PropTypes.func.isRequired,
};

TooltipTableRow.defaultProps = {
  tooltip: null,
};

export default TooltipTableRow;
