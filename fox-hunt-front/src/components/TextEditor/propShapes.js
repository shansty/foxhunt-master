import PropTypes from 'prop-types';

export const leafShape = PropTypes.shape({
  text: PropTypes.string,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  underline: PropTypes.bool,
  code: PropTypes.bool,
});

export const elementShape = PropTypes.shape({
  type: PropTypes.string,
  children: PropTypes.arrayOf(leafShape),
});
