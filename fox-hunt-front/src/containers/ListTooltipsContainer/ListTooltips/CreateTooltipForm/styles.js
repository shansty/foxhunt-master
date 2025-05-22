import { styled, Typography, Button } from '@mui/material';

const HELP_TEXT_PARAGRAPH_HEIGHT = '19px';

export const Index = styled(Typography)({
  marginBottom: HELP_TEXT_PARAGRAPH_HEIGHT,
});

export const ActionButton = styled(Button)(({ theme }) => ({
  marginBottom: HELP_TEXT_PARAGRAPH_HEIGHT,
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
  },
}));
