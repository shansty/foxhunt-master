import { styled } from '@mui/material';
import { Editable } from 'slate-react';
import Box from '@mui/material/Box';

export const StyledContainer = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
}));

export const StyledEditor = styled(Editable)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: 250,
}));
