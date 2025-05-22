import _ from 'lodash';
import { FormikHelpers } from 'formik';
import intersect from '@turf/intersect';
import inside from 'point-in-polygon';

import {
  createLocation,
  updateLocation,
} from 'src/store/actions/locationsActions';
import { useAppSelector, useAppDispatch } from 'src/store/hooks';
import { selectCurrentOrganization } from 'src/store/selectors/authSelectors';
import { NOTIFY_COORDINATES } from 'src/constants/notifyConst';
import { ForbiddenArea, Location } from 'src/types/Location';

export default function useOnLocationSave(
  goToListLocationsPage: () => void,
  location: Location,
  locationState: Location,
  showErrorMessage: (message: string) => void,
) {
  const dispatch = useAppDispatch();
  const organization = useAppSelector(selectCurrentOrganization);

  const cropForbiddenAreaPolygon = (
    forbiddenArea: ForbiddenArea,
    locationCoordinates: [][],
  ): ForbiddenArea[] | null => {
    const forbiddenAreaPolygon: any = {
      type: 'Polygon',
      coordinates: [forbiddenArea.polygon],
    };
    const locationAreaPolygon: any = {
      type: 'Polygon',
      coordinates: [locationCoordinates],
    };

    const intersection = intersect(forbiddenAreaPolygon, locationAreaPolygon);

    if (!intersection) return null;

    if (intersection?.geometry?.coordinates?.length > 1) {
      return intersection.geometry.coordinates.map((intersection) => {
        return { id: forbiddenArea.id, polygon: intersection.flat() };
      });
    }

    return [
      {
        id: forbiddenArea.id,
        polygon: intersection?.geometry.coordinates.flat(),
      },
    ];
  };

  const validateLocationArea = (
    locationCoordinates: [][],
    forbiddenAreas: ForbiddenArea[],
  ) => {
    const areas: ForbiddenArea[] = [];

    const addCroppedForbiddenAreas = (forbiddenArea: ForbiddenArea) => {
      const polygonIntersections = cropForbiddenAreaPolygon(
        forbiddenArea,
        locationCoordinates,
      );

      if (polygonIntersections) areas.push(...polygonIntersections);
    };

    const addWholeForbiddenAreas = (forbiddenArea: ForbiddenArea) => {
      if (
        !forbiddenArea.polygon.find(
          (item: number[]) => !inside(item, locationCoordinates),
        )
      )
        areas.push(forbiddenArea);
    };

    for (const forbiddenArea of forbiddenAreas) {
      for (const forbiddenAreaVertex of forbiddenArea.polygon) {
        if (!inside(forbiddenAreaVertex, locationCoordinates)) {
          addCroppedForbiddenAreas(forbiddenArea);

          break;
        } else {
          addWholeForbiddenAreas(forbiddenArea);
        }
      }
    }

    return [...new Set(areas)];
  };

  const smoothRedirect = (res: any) => {
    setTimeout(() => {
      if (res.status < 400) {
        // to verify if an operation does not fail due to an error, for instance, '400'
        goToListLocationsPage();
      }
    }, 500);
  };

  const onSave = (
    formValues: Location,
    { setSubmitting }: FormikHelpers<Location>,
  ) => {
    setSubmitting(false);
    const { coordinates, center, zoom, forbiddenAreas } = locationState;

    const { id } = location;

    if (!(coordinates.length > 3)) {
      showErrorMessage(NOTIFY_COORDINATES);
      return;
    }

    const newLocation: Location = {
      ...formValues,
      coordinates: coordinates,
      center: center,
      zoom: zoom,
      global: organization.system,
      forbiddenAreas: validateLocationArea(coordinates, forbiddenAreas),
    };

    id
      ? dispatch(updateLocation(newLocation)).then(({ payload }) =>
          smoothRedirect(payload),
        )
      : dispatch(createLocation(newLocation)).then(({ payload }) =>
          smoothRedirect(payload),
        );
  };

  return onSave;
}
