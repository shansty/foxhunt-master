import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from 'src/store';

import '../src/theme/assets/base.scss';
import MuiTheme from '../src/theme';

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
  (Story) => (
    <Provider store={store}>
      <ThemeProvider theme={MuiTheme}>{Story()}</ThemeProvider>
    </Provider>
  ),
];
