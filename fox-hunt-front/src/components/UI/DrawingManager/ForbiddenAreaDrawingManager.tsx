import React, { Fragment, useState, useEffect } from 'react';
import './DrawingManager.scss';
import { ReactComponent as PolygonSVG } from '../../../assets/images/polygon.svg';
import { Add, Remove } from '@mui/icons-material';
import { Select, MenuItem, Box, ButtonBase } from '@mui/material';
import { isFeatureEnabled } from '../../../featureToggles/FeatureTogglesUtils';
import { FORBIDDEN_AREA } from '../../../featureToggles/featureNameConstants';

export interface ForbiddenAreaDrawingManagerProps {
  addForbiddenArea: () => Promise<any>;
  removeForbiddenArea: (areaSelect: string | number) => Promise<any>;
  clickOnForbiddenAreaDrawManager: (
    areaSelect: string | number,
    func: (forbiddenAreaDrawing: boolean) => void,
  ) => void;
  forbiddenAreas: { id: string }[];
  areaSelect: string | number;
  setAreaSelect: (areaSelect: string | number) => void;
  turnOffAllForbiddenAreaEditors: () => void;
  polygon: number[][];
  isFullscreen: boolean;
}

const ForbiddenAreaDrawingManager = (
  props: ForbiddenAreaDrawingManagerProps,
) => {
  const [forbiddenAreaDrawing, setForbiddenAreaDrawing] = useState(false);
  const isForbiddenAreaFeatureEnabled = isFeatureEnabled(FORBIDDEN_AREA);
  const { polygon, turnOffAllForbiddenAreaEditors, isFullscreen } = props;

  useEffect(() => {
    if (isForbiddenAreaFeatureEnabled) {
      setForbiddenAreaDrawing(false);
      turnOffAllForbiddenAreaEditors();
    }
  }, [
    props.areaSelect,
    props.forbiddenAreas,
    turnOffAllForbiddenAreaEditors,
    isForbiddenAreaFeatureEnabled,
  ]);
  return (
    <Fragment>
      {isForbiddenAreaFeatureEnabled && polygon.length > 3 && (
        <div
          className={`manager forbidArea ${isFullscreen && 'forbidFullscreen'}`}
          data-testid="forbidden-manager"
        >
          <Box style={{ maxWidth: 500 }} className="forbidden_areas_section">
            <span>Forbidden area :&nbsp;</span>
            {props.forbiddenAreas?.length ? (
              <Select
                value={props.areaSelect}
                variant="standard"
                onChange={(e, index: any) =>
                  props.setAreaSelect(index.props.value)
                }
                data-testid="select-area"
              >
                <MenuItem value="notSelected">
                  <em
                    data-testid="select-area-option"
                    style={{ fontWeight: 'bold' }}
                  >
                    not selected
                  </em>
                </MenuItem>
                {props.forbiddenAreas.map((area, index) => (
                  <MenuItem key={area.id} value={area.id}>
                    <em
                      data-testid="select-area-option"
                      style={{ fontWeight: 'bold' }}
                    >
                      Area {index + 1}
                    </em>
                  </MenuItem>
                ))}
              </Select>
            ) : null}

            <ButtonBase
              onClick={() => {
                props.addForbiddenArea().then((id) => props.setAreaSelect(id));
              }}
            >
              <Add />
            </ButtonBase>
            {props.forbiddenAreas?.length && props.areaSelect ? (
              <PolygonSVG
                data-testid="polygon-svg"
                onClick={() =>
                  props.clickOnForbiddenAreaDrawManager(
                    props.areaSelect,
                    (forbiddenAreaDrawing) => {
                      setForbiddenAreaDrawing(forbiddenAreaDrawing);
                    },
                  )
                }
                className={`polygonSVG ${
                  forbiddenAreaDrawing ? 'drawingEnabled' : ''
                }`}
                title={
                  forbiddenAreaDrawing
                    ? 'Click To Stop Drawing'
                    : 'Click To Start Drawing'
                }
              />
            ) : null}

            <ButtonBase
              disabled={!props.forbiddenAreas?.length}
              onClick={() => {
                props
                  .removeForbiddenArea(props.areaSelect)
                  .then((id) => props.setAreaSelect(id));
              }}
            >
              <Remove />
            </ButtonBase>
          </Box>
        </div>
      )}
    </Fragment>
  );
};

export default ForbiddenAreaDrawingManager;
