import React from 'react';
import { Feature } from '@paralleldrive/react-feature-toggles';
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
