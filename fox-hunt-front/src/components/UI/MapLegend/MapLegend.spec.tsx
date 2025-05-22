import React from 'react';
import { render, screen } from '@testing-library/react';
import MapLegend from '.';

describe('MapLegend', () => {
  it('should contain title text', () => {
    render(<MapLegend direction="row" />);
    expect(screen.getByText(/Legend/i)).toBeInTheDocument();
  });

  it('should contain start & finish labels text', () => {
    render(<MapLegend direction="row" />);
    expect(screen.getByText(/Start Point/i)).toBeInTheDocument();
    expect(screen.getByText(/Finish Point/i)).toBeInTheDocument();
  });

  it('should contain transmitter label text', () => {
    render(<MapLegend direction="row" />);
    expect(screen.getByText(/Transmitter/i)).toBeInTheDocument();
  });

  it('should contain active fox label text', () => {
    render(<MapLegend direction="row" />);
    expect(screen.getByText(/Active Fox/i)).toBeInTheDocument();
  });

  it('should contain start & finish circles with text', () => {
    render(<MapLegend direction="row" />);
    const startCircle = screen.getByTestId('startCircle');
    const finishCircle = screen.getByTestId('finishCircle');
    const startCircleText = screen.getByText('S');
    const finishCircleText = screen.getByText('F');
    expect(startCircle).toBeInTheDocument();
    expect(finishCircle).toBeInTheDocument();
    expect(startCircleText).toBeInTheDocument();
    expect(finishCircleText).toBeInTheDocument();
  });

  it('should contain transmitter circle with text', () => {
    render(<MapLegend direction="row" />);
    const transmitterCircle = screen.getByTestId('transmitterCircle');
    const transmitterCircleText = screen.getByText('T');
    expect(transmitterCircle).toBeInTheDocument();
    expect(transmitterCircleText).toBeInTheDocument();
  });

  it('should contain active fox circle with text', () => {
    render(<MapLegend direction="row" />);
    const activeCircle = screen.getByTestId('activeCircle');
    const activeCircleText = screen.getByText('A');
    expect(activeCircle).toBeInTheDocument();
    expect(activeCircleText).toBeInTheDocument();
  });
});
