import React, { Fragment } from 'react';
import './DrawingManager.scss';
import PolygonSVG from 'src/assets/images/polygon.svg?react';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { isFeatureEnabled } from '../../../featureToggles/FeatureTogglesUtils';
import { LOCATION_MANAGEMENT } from '../../../featureToggles/featureNameConstants';

export interface LocationDrawingManagerProps {
  isEnabledToDraw: boolean;
  clickOnDrawManager: () => void;
  onTrashIconClick: () => void;
  setDrawingManagerRef?: () => void;
  isFullscreen: boolean;
}

const LocationDrawingManager = (props: LocationDrawingManagerProps) => {
  const {
    isFullscreen,
    isEnabledToDraw,
    clickOnDrawManager,
    onTrashIconClick,
  } = props;
  const isLocationManagementFeatureEnabled =
    isFeatureEnabled(LOCATION_MANAGEMENT);
  return (
    <Fragment>
      {isLocationManagementFeatureEnabled && (
        <div
          className={`manager locationArea ${
            isFullscreen && 'locationFullscreen'
          }`}
          data-testid="location-manager"
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Location area :&nbsp;</span>
            <Box>
              <PolygonSVG
                className={`polygonSVG ${
                  isEnabledToDraw ? 'drawingEnabled' : ''
                }`}
                onClick={clickOnDrawManager}
                aria-label={
                  isEnabledToDraw
                    ? 'Click To Stop Drawing'
                    : 'Click To Start Drawing'
                }
                data-testid="polygon-svg"
              />
              <IconButton onClick={onTrashIconClick}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </div>
      )}
    </Fragment>
  );
};

export default LocationDrawingManager;
