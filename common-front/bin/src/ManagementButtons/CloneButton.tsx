import React from 'react';
import Button from '@mui/material/Button';

export interface CloneButtonProps {
  onClick: () => void;
}
export const CloneButton = ({ onClick }: CloneButtonProps) => (
  <Button variant="contained" onClick={onClick}>
    Clone
  </Button>
);
