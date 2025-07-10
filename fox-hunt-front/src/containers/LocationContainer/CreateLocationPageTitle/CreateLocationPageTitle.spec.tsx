import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CreateLocationPageTitle from '.';

jest.mock('common-front', () => ({
  PageTitle: ({
    titleHeading,
    titleDescription,
  }: {
    titleHeading: string;
    titleDescription: string;
  }) => (
    <div>
      <h1>{titleHeading}</h1>
      <p>{titleDescription}</p>
    </div>
  ),
}));

describe('CreateLocationPageTitle', () => {
  it('should contain title and description', () => {
    render(<CreateLocationPageTitle />);
    const title = screen.getByText(/Locations/i);
    expect(title).toBeInTheDocument();
    const description = screen.getByText(/Create a location/i);
    expect(description).toBeInTheDocument();
  });
});
