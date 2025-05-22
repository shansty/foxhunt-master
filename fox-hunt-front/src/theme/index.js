import { createTheme } from '@mui/material/styles';
import typography from './typography';

import vars from '../theme/assets/core/_variables-mui.scss';

const MuiTheme = createTheme({
  palette: {
    primary: {
      main: vars.primary,
    },
    grey: {
      300: vars.inheritDefault1,
      A100: vars.inheritDefault2,
    },
    secondary: {
      main: vars.secondary,
    },
    error: {
      main: vars.red,
    },
    success: {
      main: vars.green,
    },
    warning: {
      main: vars.orange,
    },
    helpers: {
      primary: vars.blue,
      main: 'rgba(25, 46, 91, .035)',
      inputFocusedLight: '#85b7d9',
      labelText: '#ccc',
    },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: '0.5rem',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          paddingLeft: '14px',
          paddingRight: '14px',
        },
        containedSizeSmall: {
          paddingLeft: '14px',
          paddingRight: '14px',
        },
        root: {
          textTransform: 'none',
          fontWeight: 'normal',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'grey' },
          style: {
            backgroundColor: vars.inheritDefault1,
          },
        },
      ],
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: vars.second,
          padding: '8px 16px',
          fontSize: '13px',
        },
        arrow: {
          color: vars.second,
        },
      },
    },
  },
  typography,
});

export default MuiTheme;
