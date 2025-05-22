import React from 'react';
import PropTypes, { oneOfType } from 'prop-types';
import { Arrow, StyledPaper, StyledPopper } from './styles';

function Popup(props) {
  const {
    isOpen,
    handleClose,
    anchor,
    arrow,
    setArrow,
    content,
    placement = 'left',
  } = props;

  const modifiers = [
    {
      name: 'offset',
      options: {
        offset: [50, 10],
      },
    },
    {
      name: 'arrow',
      options: {
        element: arrow,
      },
    },
  ];

  return (
    <StyledPopper
      open={isOpen}
      anchorEl={anchor}
      placement={placement}
      onClose={handleClose}
      modifiers={modifiers}
    >
      <Arrow ref={setArrow} />
      <StyledPaper>{content}</StyledPaper>
    </StyledPopper>
  );
}

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchor: oneOfType([PropTypes.element, PropTypes.object, PropTypes.bool]),
  arrow: oneOfType([PropTypes.element, PropTypes.object, PropTypes.bool]),
  setArrow: PropTypes.func.isRequired,
  content: PropTypes.element.isRequired,
  placement: PropTypes.string,
};

Popup.defaultProps = {
  placement: 'left',
};

export default Popup;
