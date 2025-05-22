import PropTypes from 'prop-types';

export const topicShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  index: PropTypes.number,
  notes: PropTypes.string,
  contents: PropTypes.object,
});

export const articleShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  index: PropTypes.number,
  notes: PropTypes.string,
  contents: PropTypes.object,
});
