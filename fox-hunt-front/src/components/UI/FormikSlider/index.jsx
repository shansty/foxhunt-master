import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import ValueLabelComponent from '../../ValueLabelComponent';

const styles = {
  left: {
    marginLeft: '30px',
  },
  right: {
    marginRight: '20px',
  },
};

const FormikSlider = ({ name, min, max, value, onChange, disabled }) => {
  const handleSliderChange = (event, newValue) => {
    onChange(name, newValue);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item sx={styles.left}>
        {min}
      </Grid>
      <Grid item xs>
        <Slider
          disabled={disabled}
          components={{
            ValueLabel: ValueLabelComponent,
          }}
          max={max}
          min={min}
          value={value}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          valueLabelDisplay="auto"
          size="small"
        />
      </Grid>
      <Grid item sx={styles.right}>
        {max}
      </Grid>
    </Grid>
  );
};

FormikSlider.propTypes = {
  name: PropTypes.string,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormikSlider;
