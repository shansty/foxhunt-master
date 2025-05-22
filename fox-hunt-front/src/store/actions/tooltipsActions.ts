import { createAsyncThunk } from '@reduxjs/toolkit';

import { tooltipsAPI } from 'src/api/admin';
import * as tooltipsTypes from './types/tooltipsTypes';
import type { Tooltip } from 'src/types/Tooltip';

export const getTooltips = createAsyncThunk(
  tooltipsTypes.GET_TOOLTIPS,
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await tooltipsAPI.get('/');
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createTooltip = createAsyncThunk(
  tooltipsTypes.CREATE_TOOLTIP,
  async (tooltip, { rejectWithValue }) => {
    try {
      const { data } = await tooltipsAPI.post('/', tooltip);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateTooltip = createAsyncThunk(
  tooltipsTypes.UPDATE_TOOLTIP,
  async (tooltip: Tooltip, { rejectWithValue }) => {
    try {
      await tooltipsAPI.put(`/${tooltip.id}`, tooltip);
      return tooltip;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const removeTooltip = createAsyncThunk(
  tooltipsTypes.REMOVE_TOOLTIP,
  async (tooltipId, { rejectWithValue }) => {
    try {
      await tooltipsAPI.delete(`/${tooltipId}`);
      return tooltipId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
