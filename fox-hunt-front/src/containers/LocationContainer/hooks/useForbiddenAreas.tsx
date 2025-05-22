import { MutableRefObject } from 'react';
import { MapEvent } from 'yandex-maps';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Location, Polygon } from 'src/types/Location';

export default function useForbiddenAreas(
  onChange: (changeSet: Partial<Location>) => void,
  location: Location,
  showErrorMessage: (message: string) => void,
  mapRef: MutableRefObject<any>,
  prevForbiddenAreas: MutableRefObject<any>,
  forbiddenAreasRef: MutableRefObject<any[]>,
  selectedForbiddenArea: string | null,
) {
  const notSelected = 'notSelected';

  const saveEditorsProgress = () => {
    const forbiddenAreas = cloneDeep(location.forbiddenAreas);
    for (const area in prevForbiddenAreas.current) {
      if (prevForbiddenAreas.current[area]) {
        const correctArea = forbiddenAreas.find(
          (item) => item.id && item.id == area,
        );
        if (correctArea) {
          correctArea.polygon = prevForbiddenAreas.current[area];
        }
      }
    }
    onChange({ forbiddenAreas });
  };

  const forbiddenAreasVertexListenerMethods = {
    beforevertexadd: (event: MapEvent) => {
      const projection = mapRef.current?.options?.get('projection');
      const coords = projection?.fromGlobalPixels(
        event.get('globalPixels'),
        mapRef.current?.getZoom(),
      );
      const polygon = [...event.get('target').geometry.getCoordinates()[0]];
      polygon.length && polygon.splice(polygon.length - 1, 0, coords);

      if (selectedForbiddenArea && selectedForbiddenArea !== notSelected) {
        prevForbiddenAreas.current[selectedForbiddenArea] = [...polygon];
      }
    },
    editingstart: () => {
      const foundPolygon = forbiddenAreasRef.current.find(
        (e) => e.id === selectedForbiddenArea,
      );
      if (foundPolygon) {
        foundPolygon.activeEditing = true;
      }
    },
    editingstop: () => {
      const foundPolygon = forbiddenAreasRef.current.find(
        (e) => e.id === selectedForbiddenArea,
      );
      if (foundPolygon) {
        foundPolygon.activeEditing = false;
      }
    },
    drawingstop: (event: MapEvent) => {
      const geometryCoordinates = event
        .get('target')
        .geometry.getCoordinates()[0];

      if (selectedForbiddenArea && selectedForbiddenArea !== notSelected) {
        prevForbiddenAreas.current[selectedForbiddenArea] = [
          ...geometryCoordinates,
        ];
      }

      saveEditorsProgress();
    },
  };

  const changeForbiddenAreasVertexListeners = (
    polygonEditor: any,
    type: string,
  ) => {
    if (polygonEditor) {
      polygonEditor.events[type](
        'drawingstop',
        forbiddenAreasVertexListenerMethods.drawingstop,
      );
      polygonEditor.events[type](
        'beforevertexadd',
        forbiddenAreasVertexListenerMethods.beforevertexadd,
      );
      polygonEditor.events[type](
        'editingstart',
        forbiddenAreasVertexListenerMethods.editingstart,
      );
      polygonEditor.events[type](
        'editingstop',
        forbiddenAreasVertexListenerMethods.editingstop,
      );
    }
  };

  const turnOffAllForbiddenAreaEditors = () => {
    forbiddenAreasRef.current.forEach((e: any) => {
      e.activeEditing = false;
      if (e.ref?.editor) {
        e.ref.editor?.stopDrawing();
        e.ref.editor?.stopEditing();
      }
    });
  };

  const toggleDrawForbiddenArea = () => (id: number, getDrawing: any) => {
    const polygon = forbiddenAreasRef.current.find((area) => area.id === id);
    getDrawing(!polygon?.activeEditing);
    if (polygon?.activeEditing) {
      turnOffAllForbiddenAreaEditors();
    } else {
      turnOffAllForbiddenAreaEditors();
      polygon?.ref.editor.startEditing();
      polygon?.ref.editor.startDrawing();
    }
  };

  const addForbiddenArea = () =>
    new Promise((resolve) => {
      const id = uuidv4();
      const { forbiddenAreas } = location;
      if (
        !_.isEmpty(_.last(forbiddenAreas)?.polygon) ||
        _.isEmpty(forbiddenAreas)
      ) {
        onChange({
          forbiddenAreas: [...location.forbiddenAreas, { id, polygon: [] }],
        });
        resolve(id);
      }
    });

  const removeForbiddenArea = (id: string) =>
    new Promise((resolve) => {
      forbiddenAreasRef.current = forbiddenAreasRef.current.filter(
        (ref) => ref.id !== id,
      );
      const removedIndex = location.forbiddenAreas.findIndex(
        (area) => area.id === id,
      );
      const forbiddenAreas = location.forbiddenAreas.filter(
        (area) => area.id !== id,
      );
      delete prevForbiddenAreas.current[Number(id)];
      onChange({ forbiddenAreas });
      resolve(
        forbiddenAreas[removedIndex]?.id ||
          forbiddenAreas[forbiddenAreas.length - 1]?.id ||
          null,
      );
    });

  const setForbiddenAreaRef = (id: number | string) => (ref: Polygon) => {
    const existingRef = forbiddenAreasRef.current.findIndex((e) => e.id === id);
    if (existingRef >= 0) {
      const previousActiveEditing =
        forbiddenAreasRef.current[existingRef].activeEditing;
      changeForbiddenAreasVertexListeners(
        forbiddenAreasRef.current[existingRef].ref?.editor,
        'remove',
      );
      forbiddenAreasRef.current[existingRef] = {
        id,
        ref,
        activeEditing: previousActiveEditing,
      };
      changeForbiddenAreasVertexListeners(ref?.editor, 'add');
    } else {
      changeForbiddenAreasVertexListeners(ref?.editor, 'add');
      forbiddenAreasRef.current = [...forbiddenAreasRef.current, { id, ref }];
    }
  };

  return {
    addForbiddenArea,
    removeForbiddenArea,
    setForbiddenAreaRef,
    toggleDrawForbiddenArea,
    turnOffAllForbiddenAreaEditors,
  };
}
