import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material';

const TextBadge = ({ text, index, onRemoveText }) => {
  const StyledTextBadge = styled('span')(({ theme }) => ({
    margin: '2px 3px',
    padding: '7px 10px',
    backgroundColor: theme.palette.helpers.main,
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    fontSize: 13,
    wordBreak: 'break-all',
  }));

  const RemoveIcon = styled('span')(({ theme }) => ({
    paddingLeft: theme.spacing(1),
    fontSize: 13,
    '&:hover': {
      cursor: 'pointer',
    },
  }));

  const removeText = useCallback(() => {
    onRemoveText(index);
  }, [index, onRemoveText]);

  return (
    <StyledTextBadge>
      {text}
      <RemoveIcon onClick={removeText}>×</RemoveIcon>
    </StyledTextBadge>
  );
};

TextBadge.propTypes = {
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onRemoveText: PropTypes.func.isRequired,
};

export default TextBadge;
