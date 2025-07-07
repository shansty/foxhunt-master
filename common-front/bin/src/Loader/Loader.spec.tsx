import { render, screen } from '@testing-library/react';
import { Loader } from '.';

const TestComponent = () => (
  <>
    <p>Test child component</p>
  </>
);

describe('Loader', () => {
  it('should display spinner component while isLoading is true', () => {
    render(
      <Loader isLoading={true}>
        <TestComponent />
      </Loader>,
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display child component when loading is finished', () => {
    render(
      <Loader isLoading={false}>
        <TestComponent />
      </Loader>,
    );
    expect(screen.getByText(/Test child component/i)).toBeInTheDocument();
  });
});
