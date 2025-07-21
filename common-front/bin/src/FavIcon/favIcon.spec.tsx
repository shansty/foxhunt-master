import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FavIcon } from '.';

const handleToggle = jest.fn();

describe('FavIcon', () => {
  it('should call handleToggle() if star icon is clicked', () => {
    render(<FavIcon handleToggle={handleToggle} starSelected={true} />);
    fireEvent.click(screen.getByTestId('icon-button'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
  it('should contain filled icon if star is selected', () => {
    render(<FavIcon handleToggle={handleToggle} starSelected={true} />);
    const filledIcon = screen.queryByTestId('filled-star-icon');
    expect(filledIcon).toBeInTheDocument();
  });
  it('should contain bordered icon if star is not selected', () => {
    render(<FavIcon handleToggle={handleToggle} starSelected={false} />);
    const borderedIcon = screen.queryByTestId('bordered-star-icon');
    expect(borderedIcon).toBeInTheDocument();
  });
  it('should show tooltip on mouse over', async () => {
    render(<FavIcon handleToggle={handleToggle} starSelected={false} />);
    fireEvent.mouseOver(screen.getByTestId('icon-button'));
    await waitFor(() => {
      expect(screen.queryByText('Add to Favorite')).toBeInTheDocument();
    });
  });
});
