import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ForbiddenAreaDrawingManager from './ForbiddenAreaDrawingManager';
import * as FeatureTogglesUtils from '../../../featureToggles/FeatureTogglesUtils';
const defaultProps = {
  addForbiddenArea: jest.fn(),
  areaSelect: '1',
  clickOnForbiddenAreaDrawManager: jest.fn(),
  forbiddenAreas: [{ id: '1', polygon: [] }],
  isEnabledToDraw: true,
  isForbiddenAreaDrawingEnabled: true,
  polygon: [
    [53.99225908958538, 27.334227172851545],
    [53.991449850818654, 27.724241821289045],
    [53.907202723159244, 27.84097155761716],
    [53.99225908958538, 27.334227172851545],
  ],
  removeForbiddenArea: jest.fn(),
  setAreaSelect: jest.fn(),
  turnOffAllForbiddenAreaEditors: jest.fn(),
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

describe('ForbiddenAreaDrawingManager', () => {
  describe('Polygon icon', () => {
    it('should call clickOnForbiddenAreaDrawManager() if polygon icon is clicked', async () => {
      render(<ForbiddenAreaDrawingManager {...defaultProps} />);

      await fireEvent.click(screen.getByTestId('polygon-svg'));
      expect(
        defaultProps.clickOnForbiddenAreaDrawManager,
      ).toHaveBeenCalledTimes(1);
    });
    it('should not contain icon red border by default', () => {
      const { container } = render(
        <ForbiddenAreaDrawingManager {...defaultProps} />,
      );
      const rebBorderClass = container.getElementsByClassName('drawingEnabled');

      expect(rebBorderClass.length).toBe(0);
    });
  });

  describe('Forbidden Area Select', () => {
    it('should display forbidden area select if at least one forbidden area is chosen', () => {
      render(<ForbiddenAreaDrawingManager {...defaultProps} />);

      expect(screen.getByTestId('select-area')).toBeInTheDocument();
    });

    it('should not display forbidden area select if no forbidden area is chosen', () => {
      const props = { ...defaultProps };
      props.forbiddenAreas = [];
      render(<ForbiddenAreaDrawingManager {...props} />);

      expect(screen.queryByTestId('select-area')).not.toBeInTheDocument();
    });
    it('should display not selected option if notSelected area is chosen', () => {
      const props = { ...defaultProps };
      props.areaSelect = 'notSelected';
      render(<ForbiddenAreaDrawingManager {...props} />);

      expect(screen.getByText('not selected')).toBeInTheDocument();
    });
  });

  it('should contain forbidden area manager when feature is enabled, polygon has at least 3 points and with full screen map', () => {
    const props = { ...defaultProps, isFullscreen: true };
    render(<ForbiddenAreaDrawingManager {...props} />);

    expect(screen.getByTestId('forbidden-manager')).toBeInTheDocument();
    const title = screen.getByText(/Forbidden area/i);
    expect(title).toBeInTheDocument();
  });

  it('should not contain forbidden area manager when polygon has less than 3 points', () => {
    const props = { ...defaultProps, polygon: [] };
    render(<ForbiddenAreaDrawingManager {...props} />);

    expect(screen.queryByTestId('forbidden-manager')).not.toBeInTheDocument();
    const title = screen.queryByText(/Forbidden area/i);
    expect(title).not.toBeInTheDocument();
  });

  it('should not contain forbidden area manager when feature is not enabled and polygon has less than 3 points', () => {
    const props = { ...defaultProps, polygon: [] };
    mock = jest
      .spyOn(FeatureTogglesUtils, 'isFeatureEnabled')
      .mockResolvedValue(false);
    render(<ForbiddenAreaDrawingManager {...props} />);

    expect(screen.queryByTestId('forbidden-manager')).not.toBeInTheDocument();
    const title = screen.queryByText(/Forbidden area/i);
    expect(title).not.toBeInTheDocument();
  });
});
