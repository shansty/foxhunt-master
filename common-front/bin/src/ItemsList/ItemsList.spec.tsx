import React, { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { ItemsList, ListProps, PageState } from './ItemsList';

const TestElementPropsClicks = (props: ListProps) => {
  const [submit, setSubmit] = useState<string>('initial submit');
  const [close, setClose] = useState<string>('initial close');
  const [loadMore, setLoadMore] = useState<PageState>({
    page: 0,
    rowsPerPage: 0,
  });
  const mockLoadData = [
    { id: 2, text: 'Second item' },
    { id: 3, text: 'Third item' },
    { id: 4, text: 'Forth item' },
    { id: 5, text: 'Fifth item' },
    { id: 6, text: 'Sixth item' },
    { id: 7, text: 'Seventh item' },
    { id: 8, text: 'Eighth item' },
    { id: 9, text: 'Ninth item' },
    { id: 10, text: 'Tenth item' },
    { id: 11, text: 'Eleventh item' },
    { id: 12, text: 'Twelfth item' },
    { id: 13, text: 'Thirteenth item' },
  ];
  const handleSubmitClick = (selectedId: number | undefined) => {
    setSubmit(`submit was clicked with: ${selectedId}`);
  };

  const handleCloseClick = () => {
    setClose('close was clicked');
  };

  const handleLoadMore = async (param: PageState) => {
    setLoadMore(param);
    return mockLoadData.slice(
      param.page * param.rowsPerPage,
      (param.page + 1) * param.rowsPerPage,
    );
  };

  const newItemsProps: ListProps = {
    title: props.title,
    defaultSelectedItem: props.defaultSelectedItem,
    onClose: handleCloseClick,
    onLoadMore: handleLoadMore,
    onSubmit: handleSubmitClick,
    withAvatar: props.withAvatar,
  };
  return (
    <>
      <p>{submit}</p>
      <p>{close}</p>
      <p>{`page: ${loadMore.page}, rowsPerPage: ${loadMore.rowsPerPage}`}</p>
      <ItemsList {...newItemsProps} />
    </>
  );
};

const defaultProps: ListProps = {
  title: 'test title',
  defaultSelectedItem: { id: 1, text: 'First item' },
  withAvatar: true,
  onSubmit: (_selectedId: number | undefined) => {},
  onClose: () => {},
  onLoadMore: async (_params: PageState) => [],
};

describe('ItemsList', () => {
  it('should render list of items with title and avatars', async () => {
    await act(async () => {
      render(<TestElementPropsClicks {...defaultProps} />);
    });
    await waitFor(async () => {
      expect(screen.getByText(/test title/i)).toBeVisible();
      expect(screen.getByText(/First item/i)).toBeVisible();
      expect(screen.getByText(/Second item/i)).toBeVisible();
      expect(screen.getByText(/Third item/i)).toBeVisible();
      expect(screen.getByText(/Forth item/i)).toBeVisible();
      const avatarsArray = await screen.findAllByTestId('PersonIcon');
      expect(avatarsArray.length).toEqual(11);
      expect(screen.getByText(/page: 0, rowsPerPage: 10/i)).toBeInTheDocument();
    });
  });

  it('should render list of items without avatars', async () => {
    const props: ListProps = { ...defaultProps, withAvatar: false };
    await act(async () => {
      render(<TestElementPropsClicks {...props} />);
    });
    await waitFor(async () => {
      expect(screen.getByText(/test title/i)).toBeVisible();
      expect(screen.getByText(/First item/i)).toBeVisible();
      expect(screen.getByText(/Second item/i)).toBeVisible();
      expect(screen.getByText(/Third item/i)).toBeVisible();
      expect(screen.getByText(/Forth item/i)).toBeVisible();
      expect(screen.queryByTestId('PersonIcon')).not.toBeInTheDocument();
    });
  });

  it('should render selected item firstly', async () => {
    await act(async () => {
      render(<TestElementPropsClicks {...defaultProps} />);
    });
    await waitFor(async () => {
      const buttonArray = await screen.findAllByRole('button');
      expect(buttonArray[0]).toHaveClass('Mui-selected');
      const items = within(buttonArray[0]).getAllByText(/First item/i);
      expect(items.length).toBe(1);
    });
  });

  it('should call onCancel if Cancel button was clicked', async () => {
    await act(async () => {
      render(<TestElementPropsClicks {...defaultProps} />);
    });
    await waitFor(async () => {
      fireEvent.click(screen.getByText(/Cancel/i));
      expect(screen.getByText(/close was clicked/i)).toBeInTheDocument();
    });
  });

  it('should call onSubmit with first item id if Ok button was clicked without changing of selected item', async () => {
    await act(async () => {
      render(<TestElementPropsClicks {...defaultProps} />);
    });
    await waitFor(async () => {
      fireEvent.click(screen.getByText(/Ok/i));
      fireEvent.click(screen.getByText(/Ok/i));
      expect(
        screen.getByText(/submit was clicked with: 1/i),
      ).toBeInTheDocument();
    });
  });

  it('should call onSubmit with coosen item id if Ok button was clicked', async () => {
    await act(async () => {
      render(<TestElementPropsClicks {...defaultProps} />);
    });
    await waitFor(async () => {
      fireEvent.click(screen.getByText(/Second item/i));
      const buttonArray = await screen.findAllByRole('button');
      expect(buttonArray[1]).toHaveClass('Mui-selected');
      fireEvent.click(screen.getByText(/Ok/i));
      expect(
        screen.getByText(/submit was clicked with: 2/i),
      ).toBeInTheDocument();
    });
  });

  it('should call onLoadMore when arrow will be clicked', async () => {
    await act(async () => {
      render(<TestElementPropsClicks {...defaultProps} />);
    });
    await waitFor(async () => {
      const arrowButton = await screen.findByTestId(
        'ArrowDropDownCircleOutlinedIcon',
      );
      fireEvent.click(arrowButton);
      expect(
        await screen.findByText(/page: 1, rowsPerPage: 10/i),
      ).toBeInTheDocument();
      expect(await screen.findByText(/Thirteenth item/i)).toBeVisible();
    });
  });
});
