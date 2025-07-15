import React from 'react';
import { DrawingManagerDisplayState } from 'src/types/Location';

import LocationDrawingManager, {
  LocationDrawingManagerProps,
} from './LocationDrawingManager';

import ForbiddenAreaDrawingManager, {
  ForbiddenAreaDrawingManagerProps,
} from './ForbiddenAreaDrawingManager';

export interface DrawingManagerWrapperProps {
  children?: React.ReactNode;
  drawingManagerDisplay: DrawingManagerDisplayState;
  locationDrawingManagerProps: LocationDrawingManagerProps;
  forbiddenAreaDrawingManagerProps: ForbiddenAreaDrawingManagerProps;
}

const DrawingManagerWrapper = ({
  children,
  drawingManagerDisplay,
  locationDrawingManagerProps,
  forbiddenAreaDrawingManagerProps,
}: DrawingManagerWrapperProps) => (
  <>
    {drawingManagerDisplay.locationDrawingManagerDisplay && (
      <LocationDrawingManager {...locationDrawingManagerProps} />
    )}
    {children}
    {drawingManagerDisplay.forbiddenAreaDrawingManagerDisplay && (
      <ForbiddenAreaDrawingManager {...forbiddenAreaDrawingManagerProps} />
    )}
  </>
);

export default DrawingManagerWrapper;
