import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import store from 'src/store';
import CloneLocationContainer from '.';
import { location } from 'src/utils/tests/mocks';

const handleClickClose = jest.fn();

describe('CloneLocationContainer', () => {
  it('should contain title, description and form', () => {
    render(
      <Provider store={store}>
        <CloneLocationContainer
          handleClickClose={handleClickClose}
          isOpen={true}
          locationToClone={location}
        />
      </Provider>,
    );
    const title = screen.getByText(/Clone a location/i);
    expect(title).toBeInTheDocument();
    const description = screen.getByText(
      /Please, enter a name for cloned location:/i,
    );
    expect(description).toBeInTheDocument();
    const input = screen.getByLabelText(/Name/i);
    expect(input).toBeInTheDocument();
  });
});
