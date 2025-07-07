import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  InputBase,
  FormHelperText,
  FormControl,
  useTheme,
} from '@mui/material';
import TextBadge from './TextBadge';
import { StyledBox, TextContainer } from './styles';

const RESERVED_ERROR_SPACE = ' ';

function MultiTextInput({ onChange, error, validateValue, placeholder }) {
  const [currentlyEnteredValue, setCurrentlyEnteredValue] = useState('');
  const [allEnteredValues, setAllEnteredValues] = useState([]);
  const [validationError, setValidationError] = useState('');
  const invalidTextError = validateValue(
    currentlyEnteredValue,
    allEnteredValues,
  );
  const theme = useTheme();

  useEffect(() => {
    onChange(allEnteredValues);
  }, [allEnteredValues, onChange]);

  const handleValueAddition = () => {
    if (!currentlyEnteredValue.trim()) return;

    if (invalidTextError) {
      setValidationError(invalidTextError);
      return;
    }

    setAllEnteredValues([...allEnteredValues, currentlyEnteredValue]);
    setCurrentlyEnteredValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleValueAddition();
    }
  };

  const handleChange = (event) => {
    setCurrentlyEnteredValue(event.target.value);
    setValidationError('');
  };

  const removeValue = (index) => {
    const updatedValues = [...allEnteredValues];
    updatedValues.splice(index, 1);
    setAllEnteredValues(updatedValues);
  };

  const inputProps = {
    root: {
      sx: {
        border: 'none',
        padding: theme.spacing(1.5),
        fontSize: 13,
      },
    },
    input: { sx: { p: 0 } },
  };

  return (
    <FormControl fullWidth>
      <StyledBox invalid={!!validationError}>
        <InputBase
          componentsProps={inputProps}
          placeholder={placeholder}
          value={currentlyEnteredValue}
          fullWidth
          onKeyDown={handleKeyDown}
          onBlur={handleValueAddition}
          onChange={handleChange}
        />
        {allEnteredValues.length !== 0 && (
          <TextContainer>
            {allEnteredValues.map((value, index) => (
              <TextBadge
                key={value + index}
                text={value}
                index={index}
                onRemoveText={removeValue}
              />
            ))}
          </TextContainer>
        )}
      </StyledBox>
      <FormHelperText error={!!validationError || !!error}>
        {validationError || error || RESERVED_ERROR_SPACE}
      </FormHelperText>
    </FormControl>
  );
}

MultiTextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  validateValue: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
};

MultiTextInput.defaultProps = {
  error: '',
  placeholder: '',
};

export default MultiTextInput;
