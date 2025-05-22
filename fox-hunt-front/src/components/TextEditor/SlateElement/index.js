import React from 'react';
import PropTypes from 'prop-types';
import { ELEMENT_TYPES } from '../util/textEditorConstants';
import { elementsConfig } from './slateElementsConfig';
import { elementShape } from '../propShapes';

export const SlateElement = ({ attributes, children, element }) => {
  const elementConfig =
    elementsConfig[element.type] || elementsConfig[ELEMENT_TYPES.PARAGRAPH];
  return React.createElement(
    elementConfig.component,
    { ...elementConfig.props, ...attributes },
    children,
  );
};

SlateElement.propTypes = {
  attributes: PropTypes.shape({
    'data-slate-node': PropTypes.string,
    ref: PropTypes.shape({
      current: PropTypes.node,
    }),
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  element: elementShape.isRequired,
};

SlateElement.defaultProps = {
  attributes: {
    'data-slate-node': '',
    ref: null,
  },
};

export default SlateElement;
