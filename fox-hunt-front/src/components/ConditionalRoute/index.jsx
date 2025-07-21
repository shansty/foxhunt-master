import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as pages from 'src/pages';
import { useFeatures } from '@paralleldrive/react-feature-toggles';

const ConditionalRoute = ({ element, toggledFeature }) => {
  const [updatedFeatures, setUpdatedFeatures] = useState([]);
  const features = useFeatures();
  const isRouteAvailable =
    updatedFeatures && updatedFeatures.includes(toggledFeature);
  useEffect(() => {
    if (features) {
      setUpdatedFeatures(features);
    }
  }, [features]);

  return isRouteAvailable ? element : <pages.NotFoundPage />;
};

ConditionalRoute.propTypes = {
  toggledFeature: PropTypes.string.isRequired,
};

export default ConditionalRoute;
