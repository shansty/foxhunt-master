import { styled } from '@mui/material';
import { Divider, Box } from '@mui/material';
import EditorButton from './EditorButton';

export const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: `2px solid ${theme.palette.divider}`,
  flexWrap: 'wrap',
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 0.5),
  alignSelf: 'stretch',
  height: 'auto',
}));

export const StyledEditorButton = styled(EditorButton)(({ theme }) => ({
  margin: theme.spacing(0.5),
  border: 'none',
  '&:not(:first-child)': {
    borderRadius: theme.shape.borderRadius,
  },
  '&:first-child': {
    borderRadius: theme.shape.borderRadius,
  },
}));
