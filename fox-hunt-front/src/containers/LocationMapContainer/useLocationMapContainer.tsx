import React, { useMemo, useState } from 'react';
import { IEvent } from 'yandex-maps';
import { Placemark, Polygon, Circle } from 'react-yandex-maps';

import { getCenterMarkerProps } from 'src/utils/markers';
import { getMapCenterCoordinates } from 'src/utils/mapUtils';
import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import { FORBIDDEN_AREA } from 'src/featureToggles/featureNameConstants';
import {
  GeometryCenter,
  Polygon as PolygonType,
  ForbiddenArea,
  DrawingManagerDisplayState,
} from 'src/types/Location';
import { STROKE_COLORS, POLYGON_OPTIONS } from 'src/constants/mapConst';
import { Troubleshoot } from '@mui/icons-material';

export default function useLocationMapContainer(
  tooltip: string,
  geometryCenter: GeometryCenter,
  onPolygonClick: (event: IEvent) => void,
  setPolygonInstanceRef: (ref: PolygonType) => void,
  polygonCoordinates: number[][],
  forbiddenAreas: ForbiddenArea[],
  selectedForbiddenArea: string | null,
  setForbiddenAreasRef?: (id: number | string) => (ref: PolygonType) => void,
  hasLocationDrawingManager?: boolean,
  hasForbiddenAreaDrawingManager?: boolean,
  customMarkers?: any,
  onDragEnd?: (event: IEvent) => void,
  isFoxRangeEnabled?: boolean,
  foxoringEnabled?: boolean,
) {
  const [drawingManagerDisplay, setDrawingManagerDisplay] =
    useState<DrawingManagerDisplayState>({
      locationDrawingManagerDisplay: false,
      forbiddenAreaDrawingManagerDisplay: false,
    });

  const isForbiddenAreaFeatureEnabled = useMemo(
    () => isFeatureEnabled(FORBIDDEN_AREA),
    [],
  );

  const { PURPLE, PINK, LIGHT_GREEN, GREEN, RED, BLACK } = STROKE_COLORS;
  const {
    EDITOR_DRAWING_CURSOR,
    EDITOR_MAX_POINTS,
    FILL_OPACITY,
    STROKE_WIDTH,
    EDITOR_MENU_MANAGER,
  } = POLYGON_OPTIONS;

  const onMapLoad = () => {
    if (hasLocationDrawingManager) {
      setDrawingManagerDisplay({
        locationDrawingManagerDisplay: hasLocationDrawingManager,
        forbiddenAreaDrawingManagerDisplay: hasForbiddenAreaDrawingManager,
      });
    }
  };

   console.dir({foxoringEnabled, isFoxRangeEnabled});


  const renderMarkers = () => {
    const markersProps = [...customMarkers];
    if (geometryCenter.displayMarker) {
      markersProps.push(
        getCenterMarkerProps({
          coordinates: getMapCenterCoordinates(geometryCenter),
          onDragEnd: geometryCenter.onDragEnd,
        }),
      );
    }

    return markersProps.flatMap((props, index) => {
      const placemarkKey = props.id ?? `placemark-${index}`;

      const elements = [
        <Placemark
          key={placemarkKey}
          geometry={props.coordinates}
          properties={{
            ...props.properties,
            id: props.id,
            hintContent: props.properties?.hintContent,
          }}
          options={props.options}
          onDragEnd={onDragEnd}
        />,
      ];

      if (props.circle && foxoringEnabled) {
        elements.push(
          <Circle
            key={props.circle.id}
            geometry={[props.circle.center, props.circle.radius]}
            properties={{ id: props.circle.id }}
            onDragEnd={onDragEnd}
            options={{
              draggable: true,
              fillColor: props.circle.isVisible
                ? 'rgba(0, 150, 255, 0.1)'
                : 'rgba(0,0,0,0)',
              strokeColor: props.circle.isVisible ? '#0096ff' : 'rgba(0,0,0,0)',
              strokeOpacity: isFoxRangeEnabled ? 0.6 : 0,
              strokeWidth: isFoxRangeEnabled ? 2 : 0,
            }}
          />,
        );
      }

      return elements;
    });
  };

  const renderPolygon = () => (
    <Polygon
      onClick={onPolygonClick}
      instanceRef={setPolygonInstanceRef}
      geometry={[polygonCoordinates]}
      options={{
        editorDrawingCursor: EDITOR_DRAWING_CURSOR,
        editorMaxPoints: EDITOR_MAX_POINTS,
        strokeColor: PURPLE,
        fillColor: PINK,
        fillOpacity: FILL_OPACITY,
        strokeWidth: STROKE_WIDTH,
        editorMenuManager: EDITOR_MENU_MANAGER,
      }}
    />
  );

  const renderForbiddenAreaPolygon = () =>
    isForbiddenAreaFeatureEnabled &&
    forbiddenAreas.map((area, index) => (
      <Polygon
        key={area.id ?? `forbidden-${index}`}
        onClick={onPolygonClick}
        instanceRef={setForbiddenAreasRef?.(area.id)}
        geometry={[area.polygon]}
        options={{
          editorDrawingCursor: EDITOR_DRAWING_CURSOR,
          editorMaxPoints: EDITOR_MAX_POINTS,
          strokeColor: selectedForbiddenArea === area.id ? LIGHT_GREEN : RED,
          fillColor: selectedForbiddenArea === area.id ? GREEN : BLACK,
          fillOpacity: FILL_OPACITY,
          strokeWidth: STROKE_WIDTH,
          editorMenuManager: EDITOR_MENU_MANAGER,
        }}
      />
    ));

  return {
    onMapLoad,
    renderMarkers,
    renderPolygon,
    renderForbiddenAreaPolygon,
    drawingManagerDisplay,
  };
}
