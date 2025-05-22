import { createAsyncThunk } from '@reduxjs/toolkit';

import { locationsAPI } from 'src/api/admin';
import * as locationTypes from './types/locationsTypes';
import { enqueueSnackbar } from './notificationsActions';
import {
  createLocationCreationSuccessfulMessage,
  createLocationEditionSuccessfulMessage,
  createLocationCloneSuccessfulMessage,
} from 'src/utils/notificationUtil';
import {
  convertToLocationArrayFromResponse,
  convertToLocationForRequest,
} from 'src/api/utils/geometryConverter';
import { Location } from 'src/types/Location';
import { createErrorMessage } from 'src/utils/notificationUtil';
import { getLocationPackages } from './locationPackagesActions';

export const getLocations = createAsyncThunk(
  locationTypes.GET_LOCATIONS,
  async (
    params: Partial<{
      name: string;
      page: number;
      size: number;
    }> = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await locationsAPI.get('/', {
        params,
      });
      const locations = convertToLocationArrayFromResponse(
        response.data.content,
      );
      return {
        data: locations,
        size: response.data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getLocationById = createAsyncThunk(
  locationTypes.GET_LOCATION,
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await locationsAPI.get(`/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createLocation = createAsyncThunk(
  locationTypes.CREATE_LOCATION,
  async (location: Location, { dispatch, rejectWithValue }) => {
    try {
      const requestLocation = convertToLocationForRequest(location);
      const response = await locationsAPI.post('', requestLocation);
      dispatch(
        enqueueSnackbar(createLocationCreationSuccessfulMessage(dispatch)),
      );
      dispatch(getLocationPackages());
      return response;
    } catch (error) {
      // Address 409 status error handling
      if (error.response.status === 409) {
        const {
          response: {
            data: { message },
          },
        } = error;
        dispatch(enqueueSnackbar(createErrorMessage(message, dispatch)));
      } else {
        return rejectWithValue(error);
      }
    }
  },
);

export const cloneLocation = createAsyncThunk(
  locationTypes.CLONE_LOCATION,
  async (location: Location, { dispatch, rejectWithValue }) => {
    try {
      const response = await locationsAPI.post(`/?sourceId=${location.id}`, {
        name: location.name,
      });
      dispatch(enqueueSnackbar(createLocationCloneSuccessfulMessage(dispatch)));
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateLocation = createAsyncThunk(
  locationTypes.UPDATE_LOCATION,
  async (location: Location, { dispatch, rejectWithValue }) => {
    try {
      const requestLocation = convertToLocationForRequest(location);
      const response = await locationsAPI.put(
        `/${location.id}`,
        requestLocation,
      );
      dispatch(
        enqueueSnackbar(createLocationEditionSuccessfulMessage(dispatch)),
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeLocation = createAsyncThunk(
  locationTypes.REMOVE_LOCATION,
  async (id: number, { rejectWithValue }) => {
    try {
      await locationsAPI.delete(`/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getFavoriteLocations = createAsyncThunk(
  locationTypes.GET_FAVORITE_LOCATIONS,
  async (params: {} = {}, { rejectWithValue }) => {
    try {
      const response = await locationsAPI.get('/favorite', {
        params,
      });
      const locations: Location[] = convertToLocationArrayFromResponse(
        response.data,
      );
      return {
        data: locations,
        size: response.data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const toggleFavoriteLocation = createAsyncThunk(
  locationTypes.TOGGLE_FAVORITE_LOCATION,
  async (location: Location, { rejectWithValue }) => {
    try {
      await locationsAPI(`/${location.id}/favorite`, {
        method: 'put',
      });
      return location;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
