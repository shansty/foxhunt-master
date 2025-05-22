import { styled, Paper, Popper } from '@mui/material';

export const StyledPopper = styled(Popper)({
  zIndex: 1301,
});

export const Arrow = styled('span')({
  right: 0,
  marginRight: '-1.9em',
  position: 'absolute',
  fontSize: 10,
  width: '3em',
  height: '3em',
  '&::before': {
    content: '""',
    margin: 'auto',
    display: 'block',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: '1em 0 1em 1em',
    borderColor: 'transparent transparent transparent grey',
  },
});

export const StyledPaper = styled(Paper)({
  maxWidth: 450,
  overflow: 'auto',
});
