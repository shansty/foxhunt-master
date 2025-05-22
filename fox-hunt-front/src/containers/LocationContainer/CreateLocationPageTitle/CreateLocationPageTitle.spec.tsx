import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateLocationPageTitle from '.';

describe('CreateLocationPageTitle', () => {
  it('should contain title and description', () => {
    render(<CreateLocationPageTitle />);
    const title = screen.getByText(/Locations/i);
    expect(title).toBeInTheDocument();
    const description = screen.getByText(/Create a location/i);
    expect(description).toBeInTheDocument();
  });
});
