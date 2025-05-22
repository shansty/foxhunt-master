import { createAsyncThunk } from '@reduxjs/toolkit';

import { locationPackagesAPI } from 'src/api/admin';
import { enqueueSnackbar } from './notificationsActions';
import {
  createLocationPackageCreationSuccessfulMessage,
  createLocationPackageEditionSuccessfulMessage,
  createLocationPackageRemovalSuccessfulMessage,
} from 'src/utils/notificationUtil';
import {
  convertToLocationPackageArrayFromResponse,
  convertToLocationPackageForRequest,
} from 'src/api/utils/geometryConverter';
import * as locationPackagesTypes from './types/locationPackagesTypes';
import type { LocationPackage } from 'src/types/LocationPackage';

export const getLocationPackages = createAsyncThunk(
  locationPackagesTypes.GET_LOCATION_PACKAGES,
  async (
    params: Partial<{
      page?: number;
      size?: number;
    }> | void = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await locationPackagesAPI.get('/', {
        params,
      });
      const locationPackages = convertToLocationPackageArrayFromResponse(
        response.data.content,
      );
      return {
        data: locationPackages,
        size: response.data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getLocationPackageById = createAsyncThunk(
  locationPackagesTypes.GET_LOCATION_PACKAGE_BY_ID,
  async (id, { rejectWithValue }) => {
    try {
      const response = await locationPackagesAPI.get(`/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createLocationPackage = createAsyncThunk(
  locationPackagesTypes.CREATE_LOCATION_PACKAGE,
  async (locationPackage, { dispatch, rejectWithValue }) => {
    try {
      const requestLocationPackage =
        convertToLocationPackageForRequest(locationPackage);
      const response = await locationPackagesAPI.post(
        '/',
        requestLocationPackage,
      );
      dispatch(
        enqueueSnackbar(
          createLocationPackageCreationSuccessfulMessage(dispatch),
        ),
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateLocationPackage = createAsyncThunk(
  locationPackagesTypes.UPDATE_LOCATION_PACKAGE,
  async (
    params: { locationPackage: LocationPackage; id: number | string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { locationPackage, id } = params;
      const requestLocationPackage =
        convertToLocationPackageForRequest(locationPackage);
      const response = await locationPackagesAPI.put(
        `/${id}`,
        requestLocationPackage,
      );
      dispatch(
        enqueueSnackbar(
          createLocationPackageEditionSuccessfulMessage(dispatch),
        ),
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeLocationPackage = createAsyncThunk(
  locationPackagesTypes.REMOVE_LOCATION_PACKAGE,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await locationPackagesAPI.delete(`/${id}`);
      dispatch(
        enqueueSnackbar(
          createLocationPackageRemovalSuccessfulMessage(dispatch),
        ),
      );
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
