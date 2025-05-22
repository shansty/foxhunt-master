import React from 'react';
import { Feature } from '@paralleldrive/react-feature-toggles';
import PropTypes from 'prop-types';

const emptyComponent = () => null;

export function ConditionalContainer(props) {
  const { feature, children } = props;

  const activeComponentFunction = () => children;

  return (
    <Feature
      name={feature}
      inactiveComponent={emptyComponent}
      activeComponent={activeComponentFunction}
    />
  );
}

// ConditionalContainer.propTypes = {
//   feature: PropTypes.string.isRequired,
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node,
//   ]).isRequired,
// };
