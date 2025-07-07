import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

function withConstantProps(constantProps) {
  return (Component) => {
    const WithConstantProps = (passedProps) => {
      const className = clsx(constantProps.className, passedProps.className);

      return (
        <Component {...constantProps} {...passedProps} className={className} />
      );
    };

    WithConstantProps.propTypes = {
      className: PropTypes.string,
    };

    return WithConstantProps;
  };
}

export default withConstantProps;
