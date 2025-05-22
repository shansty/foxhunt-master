export const DEFAULT_CENTER_COORDINATES = [53.907, 27.567];
export const LOCATION_CENTER_POINT_MARKER_TOOLTIP =
  'Specify center point of a Map';

export const STROKE_COLORS = {
  PURPLE: '#692476',
  PINK: '#FE73D5',
  LIGHT_GREEN: '#00ff44',
  GREEN: '#008000',
  RED: '#ff0000',
  BLACK: '#000000',
};

export const POLYGON_OPTIONS = {
  EDITOR_DRAWING_CURSOR: 'crosshair',
  EDITOR_MAX_POINTS: 50,
  FILL_OPACITY: 0.17,
  STROKE_WIDTH: 3,
  EDITOR_MENU_MANAGER: (t: any) => {
    return t.filter((t: any) => 'addInterior' !== t.id);
  },
};

export const DEFAULT_MAP_SIZE = {
  HEIGHT: '500px',
  WIDTH: '100%',
};

export const MAP_MODULES = ['package.full'];
export const LANG = 'en_US';
export const YANDEX_KEY = '6aa4b6e3-52e1-41d4-9cd2-70a55dcebdb1';

export const COMPARE_COLOR_VALUE = 25;
export const COMPARE_COLOR_VALUE_MAX = 10;
