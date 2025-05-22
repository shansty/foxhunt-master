import { ThemeProvider } from '@mui/material/styles';

import '../../../fox-hunt-front/src/theme/assets/base.scss';
import MuiTheme from '../../../fox-hunt-front/src/theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => <ThemeProvider theme={MuiTheme}>{Story()}</ThemeProvider>,
];
