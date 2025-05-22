import React from 'react';
import Button from '@mui/material/Button';

export interface DeleteButtonProps {
  onClick: () => void;
}
export const DeleteButton = ({ onClick }: DeleteButtonProps) => (
  <Button
    variant="contained"
    color={'primary'}
    style={{ backgroundColor: '#c9282b' }}
    onClick={onClick}
  >
    Delete
  </Button>
);
