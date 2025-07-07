import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { leafsConfig } from './slateLeafsConfig';
import { leafShape } from '../propShapes';

const SlateLeaf = ({ attributes, children, leaf }) => {
  let childrenElements = React.Children.map(children, (child) =>
    React.cloneElement(child),
  );
  Object.keys(leaf).forEach((key) => {
    if (key !== 'text' && leaf[key]) {
      const leafConfig = leafsConfig[key];
      childrenElements = React.createElement(
        leafConfig.component,
        { ...leafConfig.props, ...attributes },
        childrenElements,
      );
    }
  });

  return (
    <Box component="span" {...attributes}>
      {childrenElements}
    </Box>
  );
};

SlateLeaf.propTypes = {
  attributes: PropTypes.shape({
    'data-slate-leaf': PropTypes.bool,
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  leaf: leafShape.isRequired,
};

SlateLeaf.defaultProps = {
  attributes: {
    'data-slate-leaf': false,
  },
};

export default SlateLeaf;
