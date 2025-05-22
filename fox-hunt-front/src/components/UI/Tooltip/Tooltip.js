import React, { useEffect } from 'react';
import { Tooltip as BootstrapTooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Tooltip = React.forwardRef((props, ref) => {
  const { id, children } = props;
  useEffect(() => {}, [children]);
  return (
    <BootstrapTooltip id={id} ref={ref} {...props}>
      {children}
    </BootstrapTooltip>
  );
});

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

Tooltip.defaultProps = {
  id: 'tooltip-example',
};

export default Tooltip;
