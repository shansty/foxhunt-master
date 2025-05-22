import React from 'react';
import PropTypes from 'prop-types';

const SortIconButton = ({
  baseSortTypeClassName,
  sort,
  className,
  ...remainingProps
}) => {
  const sortClassName = `${baseSortTypeClassName}-${
    sort === 'desc' ? sort : 'asc'
  }`;
  return (
    <i className={`${sortClassName} fa ${className}`} {...remainingProps} />
  );
};

SortIconButton.propTypes = {
  baseSortTypeClassName: PropTypes.string,
  sort: PropTypes.string,
  className: PropTypes.string,
};

SortIconButton.defaultProps = {
  sort: 'asc',
  baseSortTypeClassName: 'fa-sort-amount',
};

export default SortIconButton;
