import { useEffect, Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  getLocationById,
  removeLocation,
} from 'src/store/actions/locationsActions';
import { useAppDispatch } from 'src/store/hooks';
import { clearCurrentLocationState } from 'src/store/slices/locationsSlice';
import { CreateLocationState, Location } from 'src/types/Location';
import {
  buildLocationUrl,
  buildNotFoundUrl,
} from 'src/api/utils/navigationUtil';
import { locationErrorSelector } from 'src/store/selectors/errorsSelectors';

export default function useLocationContainer(
  location: Location,
  setLocationState: Dispatch<SetStateAction<Location>>,
  propsId?: string,
) {
  const locationError = useSelector(locationErrorSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLocationState((locationState: Location) => ({
      ...locationState,
      coordinates: location.coordinates,
      center: location.center,
      forbiddenAreas: location.forbiddenAreas,
      zoom: location.zoom,
    }));
  }, [location, setLocationState]);

  useEffect(() => {
    if (propsId) {
      dispatch(getLocationById(propsId));
      if (locationError) {
        navigate(buildNotFoundUrl());
      }
    }
    return () => {
      dispatch(clearCurrentLocationState());
    };
  }, [propsId, getLocationById, clearCurrentLocationState, locationError]);

  const remove = (id: number) => {
    dispatch(removeLocation(id)).then(() => {
      navigate(buildLocationUrl());
    });
  };

  return remove;
}
