import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LocationDrawingManager from './LocationDrawingManager';
import * as FeatureTogglesUtils from '../../../featureToggles/FeatureTogglesUtils';

const defaultProps = {
  isEnabledToDraw: true,
  clickOnDrawManager: jest.fn(),
  onTrashIconClick: jest.fn(),
  setDrawingManagerRef: jest.fn(),
  isFullscreen: false,
};
let mock: any;

beforeEach(() => {
  mock = jest
    .spyOn(FeatureTogglesUtils, 'isFeatureEnabled')
    .mockResolvedValue(true);
});

afterEach(() => {
  mock.mockRestore();
});

describe('LocationDrawingManager', () => {
  it('should not contain icon red border when location drawing is not enabled', () => {
    const { container } = render(
      <LocationDrawingManager {...defaultProps} isEnabledToDraw={false} />,
    );
    const rebBorderClass = container.getElementsByClassName('drawingEnabled');

    expect(rebBorderClass.length).toBe(0);
  });

  it('should contain icon red border when location drawing is enabled', () => {
    const { container } = render(<LocationDrawingManager {...defaultProps} />);
    const redBorderClass = container.getElementsByClassName('drawingEnabled');

    expect(redBorderClass.length).toBe(1);
  });

  it('should contain drawing manager when feature is enabled with a full screen map', () => {
    const props = { ...defaultProps, isFullscreen: true };
    render(<LocationDrawingManager {...props} />);

    expect(screen.getByTestId('location-manager')).toBeInTheDocument();
    const title = screen.getByText(/Location area/i);
    expect(title).toBeInTheDocument();
  });

  it('should call clickOnDrawManager() if polygon icon is clicked', async () => {
    render(<LocationDrawingManager {...defaultProps} />);

    await fireEvent.click(screen.getByTestId('polygon-svg'));
    expect(defaultProps.clickOnDrawManager).toHaveBeenCalledTimes(1);
  });
});
