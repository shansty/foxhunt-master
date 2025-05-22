import _ from 'lodash';

/**
 * This map is used as a helper in fox points generator function.
 * Designed to check if a point already exists or not in O(1).
 */
export class PointsMap {
  _map = {};

  constructor(points) {
    if (Array.isArray(points) && points.length) {
      points.forEach((coordinates) => this.add(coordinates));
    }
  }

  add = (coordinates) => {
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      if (!this._map[coordinates[0]])
        this._map[coordinates[0]] = {
          [coordinates[1]]: coordinates[1],
        };
      if (this._map[coordinates[0]])
        this._map[coordinates[0]][coordinates[1]] = coordinates[1];
    }
    return this._map;
  };

  contains = (coordinates) => {
    if (_.isEmpty(this._map)) return false;
    if (Array.isArray(coordinates) && coordinates.length === 2) {
      if (!this._map[coordinates[0]]) return false;
      return !!this._map[coordinates[0]][coordinates[1]];
    }
    return false;
  };
}
