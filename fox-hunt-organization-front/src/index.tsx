import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider, Theme } from '@mui/material/styles';
import MuiTheme from './theme';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={MuiTheme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        preventDuplicate
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
