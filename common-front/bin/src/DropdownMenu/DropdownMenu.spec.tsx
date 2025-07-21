import { ReactNode, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownMenu, DropdownMenuItem } from '.';
import { CustomRouter, TestPage } from '../utils';

const TestActionElement = (props: DropdownMenuItem) => {
  const [value, setValue] = useState<string>('initial value');

  const handleClick = () => {
    setValue('value was changed');
  };

  return (
    <>
      <p>{value}</p>
      <DropdownMenu
        items={[
          {
            id: props.id,
            title: props.title,
            action: handleClick,
            to: props.to,
          },
        ]}
      />
    </>
  );
};

const TestRouterElement = (props: { element: ReactNode }) => {
  return (
    <Routes>
      <Route path="/" element={props.element} />
      <Route path="testPage" element={<TestPage />} />
    </Routes>
  );
};

describe('DropdownMenu', () => {
  it('should change menu visibility after clicking on icon button', () => {
    render(
      <CustomRouter>
        <DropdownMenu items={[{ id: 1, title: 'test title' }]} />
      </CustomRouter>,
    );
    expect(screen.getByText(/test title/i)).not.toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /icon-button/i }));
    expect(screen.getByText(/test title/i)).toBeVisible();
    const TransparentDivCreatedByMuiToCloseMenuByClickingOnIt =
      screen.getByRole('presentation').firstChild as HTMLElement;
    fireEvent.click(TransparentDivCreatedByMuiToCloseMenuByClickingOnIt);
    expect(screen.getByText(/test title/i)).not.toBeVisible();
  });

  it('should not render menu without items props', () => {
    render(
      <CustomRouter>
        <DropdownMenu items={[]} />
      </CustomRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /icon-button/i }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should route to other page after menu item clicking', () => {
    render(
      <CustomRouter>
        <TestRouterElement
          element={
            <DropdownMenu
              items={[{ id: 1, title: 'test title', to: '/testPage' }]}
            />
          }
        />
      </CustomRouter>,
    );
    fireEvent.click(screen.getByText(/test title/i));
    expect(screen.getByText(/You are on the test page/i)).toBeVisible();
  });

  it('should execute props action after menu item clicking', () => {
    render(
      <CustomRouter>
        <TestActionElement id={1} title="test title" />
      </CustomRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /icon-button/i }));
    expect(screen.queryByText(/test title/i)).toBeVisible();
    fireEvent.click(screen.getByText(/test title/i));
    expect(screen.getByText(/value was changed/i)).toBeVisible();
    expect(screen.queryByText(/test title/i)).not.toBeVisible();
  });

  it('should execute props action and route to other page after menu item clicking', () => {
    render(
      <CustomRouter>
        <TestRouterElement
          element={
            <TestActionElement id={1} title="test title" to="/testPage" />
          }
        />
      </CustomRouter>,
    );
    fireEvent.click(screen.getByText(/test title/i));
    expect(screen.getByText(/You are on the test page/i)).toBeVisible();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
