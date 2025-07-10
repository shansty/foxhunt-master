import React, { useMemo, useState } from 'react';
import { IEvent } from 'yandex-maps';

import useLocationMapContainer from './useLocationMapContainer';
import DrawingManagerWrapper from 'src/components/UI/DrawingManager';
import MapContainer from '../MapContainer';
import { YANDEX } from 'src/constants/mapProviderConstants';
import { ForbiddenArea, Polygon, GeometryCenter } from 'src/types/Location';

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
  customMarkers?: [];
  className?: string;
  children?: React.ReactNode;
  setForbiddenAreasRef?: (id: number | string) => (ref: Polygon) => void;
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
}: LocationMapContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ Stable fallback for geometryCenter
  const stableGeometryCenter = useMemo(() => {
    return (
      geometryCenter ?? {
        displayMarker: false,
        coordinates: [0, 0],
        onDragEnd: () => {},
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
  );

  const onSizeChange = (event: IEvent) => {
    setIsFullscreen(event.get('target').container.isFullscreen() || false);
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
        {renderPolygon()}
        {setForbiddenAreasRef && renderForbiddenAreaPolygon()}
        {children}
      </MapContainer>
    </DrawingManagerWrapper>
  );
};

export default LocationMapContainer;
