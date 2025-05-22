import React from 'react';
import CSS from 'csstype';
import { Box, Grid } from '@mui/material';
import vars from 'src/styles/_variables.scss';

export interface MapLegendProps {
  titleStyles?: CSS.Properties;
  direction: 'row' | 'column';
}

const getPointStyles = (color: string) => ({
  width: 26,
  height: 26,
  border: `3px solid ${color}`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const legendItemStyles = {
  alignItems: 'baseline',
  width: 'auto',
};

const MapLegend = ({ titleStyles, direction, ...props }: MapLegendProps) => (
  <Box {...props}>
    <div className="font-weight-bold" style={titleStyles}>
      Legend
    </div>
    <Grid columnSpacing={2} container direction={direction} rowSpacing={1}>
      <Grid item sx={legendItemStyles} container direction="row">
        <div
          data-testid="startCircle"
          style={getPointStyles(vars.startMarkerColor)}
        >
          S
        </div>
        &nbsp;- Start Point
      </Grid>
      <Grid item sx={legendItemStyles} container direction="row">
        <div
          data-testid="finishCircle"
          style={getPointStyles(vars.finishMarkerColor)}
        >
          F
        </div>
        &nbsp;- Finish Point
      </Grid>
      <Grid item sx={legendItemStyles} container direction="row">
        <div
          data-testid="transmitterCircle"
          style={getPointStyles(vars.foxMarkerColor)}
        >
          T
        </div>
        &nbsp;- Transmitter (Fox)
      </Grid>
      <Grid item sx={legendItemStyles} container direction="row">
        <div
          data-testid="activeCircle"
          style={getPointStyles(vars.activeFoxMarkerColor)}
        >
          A
        </div>
        &nbsp;- Active Fox
      </Grid>
      <Grid item sx={legendItemStyles} container direction="row">
        <div
          data-testid="disconnectedCircle"
          style={getPointStyles(vars.disconnectedParticipantColor)}
        >
          D
        </div>
        &nbsp;- Disconnected Participant
      </Grid>
    </Grid>
  </Box>
);

export default MapLegend;
