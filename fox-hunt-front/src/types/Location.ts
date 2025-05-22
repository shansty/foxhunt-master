import { IGeometryEditor, Polygon as MainPolygon, IEvent } from 'yandex-maps';
import { User } from './User';

export interface Location {
  center: number[];
  coordinates: any[];
  isFavorite: boolean;
  createdBy?: User;
  description?: string;
  global?: boolean;
  id?: any;
  name?: string;
  updatedBy?: User;
  zoom: number;
  updatable?: boolean;
  forbiddenAreas: ForbiddenArea[];
  updatedDate?: string;
  createdDate?: string;
}

export interface CreateLocationState {
  areAllObjectsFetched: boolean;
  match?: string;
}

export interface DrawingManagerDisplayState {
  locationDrawingManagerDisplay?: boolean;
  forbiddenAreaDrawingManagerDisplay?: boolean;
}

export interface ForbiddenArea {
  id: string | number;
  polygon: any;
}

export interface GeometryCenter {
  displayMarker: boolean;
  coordinates: number[];
  onDragEnd: (event: IEvent) => void;
}

export interface IEditor extends IGeometryEditor {
  startDrawing(): void;
}

export interface Polygon extends MainPolygon {
  editor: IEditor;
  id: string | number;
  activeEditing: boolean;
  ref: any;
}
