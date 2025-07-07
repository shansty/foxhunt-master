import React from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import ToggleButton from '@mui/material/ToggleButton';

const EditorButton = ({
  format,
  icon,
  className,
  isSelected,
  toggleButton,
}) => {
  const editor = useSlate();

  const onMouseDown = (event) => {
    event.preventDefault();
    toggleButton(editor, format);
  };

  return (
    <ToggleButton
      className={className}
      value={format}
      selected={isSelected(editor, format)}
      onMouseDown={onMouseDown}
    >
      {icon}
    </ToggleButton>
  );
};

EditorButton.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  className: PropTypes.string,
  isSelected: PropTypes.func.isRequired,
  toggleButton: PropTypes.func.isRequired,
};

EditorButton.defaultProps = {
  className: '',
};

export default EditorButton;
