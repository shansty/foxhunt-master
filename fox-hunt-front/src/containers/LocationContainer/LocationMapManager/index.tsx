import React, { useState, useRef } from 'react';
import { IEvent } from 'yandex-maps';

import { LOCATION_CENTER_POINT_MARKER_TOOLTIP } from 'src/constants/mapConst';
import { Location, Polygon } from 'src/types/Location';
import LocationMapContainer from 'src/containers/LocationMapContainer';
import useForbiddenAreas from '../hooks/useForbiddenAreas';

export interface LocationMapManagerProps {
  location: Location;
  onChange: (changeSet: Partial<Location>) => void;
  showErrorMessage: (message: string) => void;
  isDrawingManagerEnabled?: boolean;
}
const LocationMapManager = ({
  location,
  onChange,
  showErrorMessage,
  isDrawingManagerEnabled,
}: LocationMapManagerProps) => {
  const forbiddenAreasRef = useRef<Polygon[]>([]);
  const prevForbiddenAreas = useRef([]);
  const mapRef = useRef<React.Ref<any> | null>(null);
  const polygonRef = useRef<Polygon | null>(null);

  const [isEnabledToDraw, setIsEnabledToDraw] = useState(false);
  const [selectedForbiddenArea, setSelectedForbiddenArea] = useState<
    string | null
  >('notSelected');

  const {
    addForbiddenArea,
    removeForbiddenArea,
    setForbiddenAreaRef,
    toggleDrawForbiddenArea,
    turnOffAllForbiddenAreaEditors,
  } = useForbiddenAreas(
    onChange,
    location,
    showErrorMessage,
    mapRef,
    prevForbiddenAreas,
    forbiddenAreasRef,
    selectedForbiddenArea,
  );

  const onCenterPointDragEnd = (event: IEvent) => {
    const coordinates = event.get('target').geometry.getCoordinates();
    onChange({ center: coordinates });
  };

  const addCenterPoint = (event: IEvent) => {
    if (isEnabledToDraw) {
      return;
    }
    const coordinates = event.get('coords');
    onChange({ center: coordinates });
  };

  const changeZoom = (event: IEvent) => {
    const zoom = event.get('newZoom');
    onChange({ zoom });
  };

  const onDrawingStop = (event: IEvent) => {
    const geometryCoordinates = event
      .get('target')
      .geometry.getCoordinates()[0];
    setIsEnabledToDraw(false);
    onChange({
      coordinates: geometryCoordinates,
    });
    polygonRef.current?.editor.stopEditing();
  };

  const toggleDrawState = () => {
    const isEnabled = !polygonRef.current?.editor?.state.get('drawing', {});
    if (isEnabled && (!location.id || location.updatable)) {
      polygonRef.current?.editor.startDrawing();
      return setIsEnabledToDraw(isEnabled);
    }
    polygonRef.current?.editor.stopEditing();
  };

  const onTrashIconClick = (location: Location) => {
    if (!location.id || location.updatable) {
      for (const forbiddenArea of location.forbiddenAreas) {
        delete prevForbiddenAreas?.current[+forbiddenArea.id];
      }
      onChange({ coordinates: [], forbiddenAreas: [] });
      setSelectedForbiddenArea(null);
    }
  };

  const setPolygonInstanceRef = (ref: Polygon) => {
    if (!polygonRef.current) {
      polygonRef.current = ref;
      polygonRef.current.editor.events.add('drawingstop', onDrawingStop);
    }
  };

  const loadMapInstance = (ref: React.Ref<any>) => (mapRef.current = ref);

  const locationDrawingManagerProps = {
    isEnabledToDraw,
    clickOnDrawManager: toggleDrawState,
    onTrashIconClick: () => onTrashIconClick(location),
  };

  const forbiddenAreaDrawingManagerProps = {
    turnOffAllForbiddenAreaEditors: turnOffAllForbiddenAreaEditors,
    areaSelect: selectedForbiddenArea,
    setAreaSelect: setSelectedForbiddenArea,
    forbiddenAreas: location.forbiddenAreas,
    addForbiddenArea: addForbiddenArea,
    removeForbiddenArea: removeForbiddenArea,
    clickOnForbiddenAreaDrawManager: toggleDrawForbiddenArea(),
    polygon: location.coordinates,
  };

  return (
    <LocationMapContainer
      setPolygonInstanceRef={setPolygonInstanceRef}
      loadMapInstance={loadMapInstance}
      setForbiddenAreasRef={setForbiddenAreaRef}
      selectedForbiddenArea={selectedForbiddenArea}
      polygonCoordinates={location.coordinates}
      forbiddenAreas={location.forbiddenAreas}
      hasLocationDrawingManager={isDrawingManagerEnabled}
      hasForbiddenAreaDrawingManager={isDrawingManagerEnabled}
      zoomValue={location.zoom}
      geometryCenter={{
        displayMarker: true,
        coordinates: location.center,
        onDragEnd: onCenterPointDragEnd,
      }}
      onPolygonClick={addCenterPoint}
      onMapClick={addCenterPoint}
      onMapBoundsChange={changeZoom}
      tooltip={LOCATION_CENTER_POINT_MARKER_TOOLTIP}
      locationDrawingManagerProps={locationDrawingManagerProps}
      forbiddenAreaDrawingManagerProps={forbiddenAreaDrawingManagerProps}
    />
  );
};

export default LocationMapManager;
