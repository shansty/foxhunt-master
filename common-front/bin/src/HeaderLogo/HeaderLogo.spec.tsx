import { Routes, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { HeaderLogo, HeaderLogoProps } from '.';
import { CustomRouter, TestPage } from '../utils';

const TestRouterElement = (props: HeaderLogoProps) => {
  return (
    <Routes>
      <Route
        path="/test"
        element={<HeaderLogo portalName={props.portalName} />}
      />
      <Route path="/" element={<TestPage />} />
    </Routes>
  );
};

describe('HeaderLogo', () => {
  it('should render logo image and portal name by default', () => {
    render(
      <CustomRouter>
        <HeaderLogo portalName={'Test Name'} />
      </CustomRouter>,
    );
    expect(screen.getByText(/Test Name/i)).toBeVisible();
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('alt', 'Test Name portal');
  });

  it('should redirect to / url after clicking ', () => {
    const history = createMemoryHistory();
    history.push('/test');
    render(
      <CustomRouter history={history}>
        <TestRouterElement portalName={'Test Name'} />
      </CustomRouter>,
    );
    const link: HTMLAnchorElement = screen.getByRole('link', {
      name: 'icon-link',
    });
    expect(link.href).toContain('/');
    fireEvent.click(link);
    expect(screen.queryByText(/test page/i)).toBeVisible();
  });
});
