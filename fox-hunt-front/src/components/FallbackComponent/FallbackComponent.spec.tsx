import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import FallbackComponent from '.';
import CustomRouter, { TestPage } from 'src/routes/CustomRouter';

const TestRouterElement = () => {
  return (
    <Routes>
      <Route
        path="/test"
        element={<FallbackComponent resetErrorBoundary={handleClick} />}
      />
      <Route path="/" element={<TestPage />} />
    </Routes>
  );
};

const handleClick = jest.fn();
const text =
  /Oops! Something went wrong... Brace yourself till we get error fixed/i;

describe('FallbackComponent', () => {
  it('should contain image', () => {
    render(
      <CustomRouter>
        <FallbackComponent resetErrorBoundary={handleClick} />
      </CustomRouter>,
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'fallback');
  });

  it('should contain title', () => {
    render(
      <CustomRouter>
        <FallbackComponent resetErrorBoundary={handleClick} />
      </CustomRouter>,
    );
    const title = screen.getByText(text);
    expect(title).toBeInTheDocument();
  });

  it('should navigate to welcome page and reset fallback component after button clicking', () => {
    const history = createMemoryHistory();
    history.push('/test');
    render(
      <CustomRouter history={history}>
        <TestRouterElement />
      </CustomRouter>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/You are on the test page/i)).toBeVisible();
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });
});
