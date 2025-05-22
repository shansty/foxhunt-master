import PropTypes from 'prop-types';

const userRoleShape = PropTypes.shape({
  id: PropTypes.number,
  role: PropTypes.string,
});

export const userShape = PropTypes.shape({
  activated: PropTypes.bool,
  activatedSince: PropTypes.string,
  completed: PropTypes.bool,
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  id: PropTypes.number,
  roles: PropTypes.arrayOf(userRoleShape),
});

export const matchShape = PropTypes.shape({
  isExact: PropTypes.bool,
  url: PropTypes.string,
  path: PropTypes.string,
  params: PropTypes.object,
});

export const historyShape = PropTypes.shape({
  action: PropTypes.string,
  length: PropTypes.number,
  block: PropTypes.func,
  createHref: PropTypes.func,
  go: PropTypes.func,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  listen: PropTypes.func,
  location: PropTypes.object,
  push: PropTypes.func,
  replace: PropTypes.func,
});

export const PagerShape = PropTypes.shape({
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
});
