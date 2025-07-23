import React, { useMemo, useState } from 'react';
import { IEvent } from 'yandex-maps';

import useLocationMapContainer from './useLocationMapContainer';
import DrawingManagerWrapper from 'src/components/UI/DrawingManager';
import MapContainer from '../MapContainer';
import { YANDEX } from 'src/constants/mapProviderConstants';
import { ForbiddenArea, Polygon, GeometryCenter } from 'src/types/Location';
import { Circle } from 'react-yandex-maps';

export type CustomMarker = {
  id: string | number;
  coordinates: [number, number];
  circleCenter?: [number, number];
  foxRange?: number;
  onDragEnd?: (event: any) => void;
  options?: {
    draggable?: boolean;
    iconColor?: string;
    [key: string]: any;
  };
  properties?: {
    iconContent?: string;
    iconCaption?: string;
    hintContent?: string;
    [key: string]: any;
  };
};

export interface LocationMapContainerProps {
  polygonCoordinates: number[][];
  setPolygonInstanceRef: (ref: Polygon) => void;
  onPolygonClick: (event: IEvent) => void;
  onMapClick: (event: IEvent) => void;
  onMapBoundsChange: (event: IEvent) => void;
  zoomValue: number;
  geometryCenter?: GeometryCenter;
  locationDrawingManagerProps: any;
  forbiddenAreas: ForbiddenArea[];
  selectedForbiddenArea: string | null;
  loadMapInstance: (ref: React.Ref<any>) => void;
  forbiddenAreaDrawingManagerProps: any;
  tooltip: string;

  onDragEnd?: (event: IEvent) => void;
  hasLocationDrawingManager?: boolean;
  hasForbiddenAreaDrawingManager?: boolean;
  customMarkers?: CustomMarker[];
  className?: string;
  children?: React.ReactNode;
  setForbiddenAreasRef?: (id: number | string) => (ref: Polygon) => void;
  isFoxRangeEnabled?: boolean;
  foxoringEnabled?: boolean;
}

const LocationMapContainer = ({
  polygonCoordinates = [],
  setPolygonInstanceRef,
  setForbiddenAreasRef,
  onPolygonClick,
  onMapClick,
  onMapBoundsChange,
  zoomValue,
  geometryCenter,
  locationDrawingManagerProps,
  className,
  forbiddenAreas,
  selectedForbiddenArea,
  loadMapInstance,
  forbiddenAreaDrawingManagerProps,
  hasLocationDrawingManager,
  hasForbiddenAreaDrawingManager,
  customMarkers = [],
  tooltip,
  children,
  onDragEnd,
  isFoxRangeEnabled,
  foxoringEnabled,
}: LocationMapContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ Stable fallback for geometryCenter
  const stableGeometryCenter = useMemo(() => {
    return (
      geometryCenter ?? {
        displayMarker: false,
        coordinates: [0, 0],
        onDragEnd: () => { },
      }
    );
  }, [geometryCenter]);

  const {
    onMapLoad,
    renderMarkers,
    renderPolygon,
    renderForbiddenAreaPolygon,
    drawingManagerDisplay,
  } = useLocationMapContainer(
    tooltip,
    stableGeometryCenter,
    onPolygonClick,
    setPolygonInstanceRef,
    polygonCoordinates,
    forbiddenAreas,
    selectedForbiddenArea,
    setForbiddenAreasRef,
    hasLocationDrawingManager,
    hasForbiddenAreaDrawingManager,
    customMarkers,
    onDragEnd,
    isFoxRangeEnabled,
    foxoringEnabled,
  );

  
  console.dir({foxoringEnabled, isFoxRangeEnabled});

  const onSizeChange = (event: IEvent) => {
    setIsFullscreen(event.get('target').container.isFullscreen() || false);
  };

  const renderFoxCircles = () => {
    if (!foxoringEnabled) return null; 

    return customMarkers
      ?.filter((marker) => marker.circleCenter && marker.foxRange !== undefined)
      .map((marker) => (
        <Circle
          key={`circle-${marker.id}-${isFoxRangeEnabled}`}
          geometry={[marker.circleCenter!, marker.foxRange!]}
          options={{
            fillColor: isFoxRangeEnabled
              ? 'rgba(0, 150, 255, 0.1)'
              : 'rgba(0, 0, 0, 0)',
            strokeColor: isFoxRangeEnabled ? '#0096ff' : 'rgba(0, 0, 0, 0)',
            strokeWidth: isFoxRangeEnabled ? 2 : 0,
          }}
        />
      ));
  };

  return (
    <DrawingManagerWrapper
      drawingManagerDisplay={drawingManagerDisplay}
      locationDrawingManagerProps={{
        ...locationDrawingManagerProps,
        isFullscreen,
      }}
      forbiddenAreaDrawingManagerProps={{
        ...forbiddenAreaDrawingManagerProps,
        isFullscreen,
      }}
    >
      <MapContainer
        zoom={zoomValue}
        center={stableGeometryCenter}
        mapProvider={YANDEX}
        onMapClick={onMapClick}
        onMapBoundsChange={onMapBoundsChange}
        onMapLoad={onMapLoad}
        loadMapInstance={loadMapInstance}
        onSizeChange={onSizeChange}
        className={className}
        drawingManager={drawingManagerDisplay}
      >
        {renderMarkers()}
        {renderFoxCircles()}
        {renderPolygon()}
        {setForbiddenAreasRef && renderForbiddenAreaPolygon()}
        {children}
      </MapContainer>
    </DrawingManagerWrapper>
  );
};

export default LocationMapContainer;
