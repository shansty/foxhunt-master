import { styled } from '@mui/material';
import { Box } from '@mui/material';

export const StyledBox = styled(Box)(({ theme, invalid }) => ({
  border: `1px solid ${
    invalid ? theme.palette.error.main : theme.palette.divider
  }`,
  borderRadius: theme.shape.borderRadius,
}));

export const TextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'row wrap',
  maxWidth: '100%',
  alignItems: 'center',
  alignContent: 'flex-start',
  margin: `${theme.spacing(1)}px 5px`,
}));
