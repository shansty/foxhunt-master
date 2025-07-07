import React from 'react';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ErrorBoundary } from 'react-error-boundary';

import AppRoutes from 'src/routes/Routes';
import CustomRouter from 'src/routes/CustomRouter';
import history from 'src/history';
import store from 'src/store';
import Notifier from 'src/Notifier';
import 'src/theme/assets/base.scss';
import { ThemeProvider } from '@mui/material/styles';
import MuiTheme from 'src/theme';
import FallbackComponent from 'src/components/FallbackComponent';

function App() {
  return (
    <>
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
            <Notifier />
            <CustomRouter history={history}>
              <ErrorBoundary FallbackComponent={FallbackComponent}>
                <AppRoutes />
              </ErrorBoundary>
            </CustomRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
