import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import store from 'src/store';

export const renderWithReduxProvider = (component: React.ReactNode) => {
  return render(<Provider store={store}>{component}</Provider>);
};
