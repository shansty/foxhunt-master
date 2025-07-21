import React from 'react';
import PropTypes from 'prop-types';
import StyledCircularProgress from './styles';

function Spinner({ size }) {
  return <StyledCircularProgress size={size} />;
}

Spinner.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Spinner.defaultProps = {
  size: 40,
};

export default Spinner;
