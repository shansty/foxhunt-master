import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const SelectComponent = (props) => {
  const { name, items, value, onChange } = props;

  return (
    <>
      <FormControl variant="outlined" size={'small'} fullWidth>
        <InputLabel>{name}</InputLabel>
        <Select value={value} onChange={onChange} label={name}>
          <MenuItem value="">-</MenuItem>
          {items.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

SelectComponent.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectComponent;
