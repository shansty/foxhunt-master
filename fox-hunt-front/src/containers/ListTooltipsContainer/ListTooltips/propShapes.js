import PropTypes from 'prop-types';

export const TooltipShape = PropTypes.shape({
  id: PropTypes.number,
  code: PropTypes.string,
  message: PropTypes.string,
});

export const SelectPropsShape = PropTypes.shape({
  MenuProps: PropTypes.shape({
    PaperProps: PropTypes.shape({
      style: PropTypes.shape({
        maxHeight: PropTypes.number,
        width: PropTypes.number,
      }),
    }),
  }),
});

export const TooltipCodeShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});
