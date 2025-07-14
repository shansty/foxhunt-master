import React, { useMemo, useState } from 'react';
import { IEvent } from 'yandex-maps';
import { Placemark, Polygon } from 'react-yandex-maps';

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

// ✅ Helper to generate accurate circular polygons
function generateGeodesicCircle(center: number[], radiusMeters: number, points = 64): number[][] {
  const [lng, lat] = center;
  const R = 6371000; // Earth radius in meters
  const coords: number[][] = [];

  for (let i = 0; i < points; i++) {
    const angle = (2 * Math.PI * i) / points;

    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);

    const newLat = lat + (dy / R) * (180 / Math.PI);
    const newLng =
      lng + (dx / (R * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);

    coords.push([newLng, newLat]);
  }

  coords.push(coords[0]); // close the loop
  return coords;
}

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

    return markersProps.map((props, index) => {
      if (props.type === 'circle') {
        const polygonCoords = generateGeodesicCircle(props.coordinates, props.radius);

        return (
          <Polygon
            key={`circle-${index}`}
            geometry={[polygonCoords]}
            options={{
              ...props.options,
              strokeStyle: 'solid',
              strokeOpacity: 0.5,
            }}
          />
        );
      }

      return (
        <Placemark
          key={props.id || `placemark-${index}`}
          geometry={props.coordinates}
          properties={{
            ...props.properties,
            id: props.id,
            hintContent: props.properties?.hintContent,
          }}
          options={props.options}
          draggable={props.draggable}
          onDragEnd={onDragEnd}
        />
      );
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
    forbiddenAreas.map((area) => (
      <Polygon
        key={area.id}
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
