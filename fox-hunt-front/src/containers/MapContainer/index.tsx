import React from 'react';
import { Map, YMaps } from 'react-yandex-maps';
import { IEvent } from 'yandex-maps';

import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import { YANDEX_MAPS } from 'src/featureToggles/featureNameConstants';
import { YANDEX } from 'src/constants/mapProviderConstants';
import { getMapCenterCoordinates } from 'src/utils/mapUtils';
import { DrawingManagerDisplayState, GeometryCenter } from 'src/types/Location';
import {
  DEFAULT_MAP_SIZE,
  LANG,
  MAP_MODULES,
  YANDEX_KEY,
} from 'src/constants/mapConst';

export interface MapContainerProps {
  zoom: number;
  center: GeometryCenter;
  onMapClick: (event: IEvent) => void;
  onMapBoundsChange: (event: IEvent) => void;
  onSizeChange: (event: IEvent) => void;
  onMapLoad: () => void;
  loadMapInstance: (ref: React.Ref<HTMLDivElement>) => void;
  drawingManager: DrawingManagerDisplayState;
  mapProvider: string;
  className?: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
}

const { HEIGHT, WIDTH } = DEFAULT_MAP_SIZE;

const MapContainer = ({
  zoom,
  center,
  onMapClick,
  onMapBoundsChange,
  onMapLoad,
  onSizeChange,
  loadMapInstance,
  className,
  drawingManager,
  mapProvider = YANDEX,
  children,
  height = HEIGHT,
  width = WIDTH,
}: MapContainerProps) => {
  console.count('MapContainer render');
  const isYandexMapEnabled = isFeatureEnabled(YANDEX_MAPS);
  const yandexMap = isYandexMapEnabled && (
    <YMaps query={{ lang: LANG, apikey: YANDEX_KEY }}>
      <Map
        state={{
          ...drawingManager,
          zoom,
          center: getMapCenterCoordinates(center),
        }}
        style={{
          height,
          width,
        }}
        modules={MAP_MODULES}
        onClick={onMapClick}
        onSizeChange={onSizeChange}
        onBoundsChange={onMapBoundsChange}
        onLoad={onMapLoad}
        instanceRef={loadMapInstance}
        className={className}
        options={{
          restrictMapArea: [
            [85, -179.9],
            [-85, 180],
          ] as any,
        }}
      >
        {children}
      </Map>
    </YMaps>
  );
  const renderSwitch = (mapProvider: string) => {
    switch (mapProvider) {
      case YANDEX:
        console.log('Yandemap');
        return yandexMap;
      default:
        console.log('DEFAULT');
        return;
    }
  };
  // return renderSwitch(mapProvider);
  return <div>{renderSwitch(mapProvider)}</div>;
};

export default MapContainer;
