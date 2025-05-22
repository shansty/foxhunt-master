import { createSlice } from '@reduxjs/toolkit';

import { tooltipsCodes } from 'src/constants/tooltipsCodes';
import type { Tooltip, Tooltips } from 'src/types/Tooltip';
import {
  getTooltips,
  createTooltip,
  updateTooltip,
  removeTooltip,
} from 'src/store/actions/tooltipsActions';
import { ENTITY as tooltips } from 'src/store/actions/types/tooltipsTypes';
import type { TooltipsSliceState } from './types';

const initialState: TooltipsSliceState = {
  tooltips: [],
  notCreatedTooltips: [],
};

const getNotCreatedTooltips = (tooltips: Tooltips) => {
  const existingCodes = tooltips.map((tooltip: Tooltip) => tooltip.code);
  return tooltipsCodes
    .filter((code) => !existingCodes.includes(code.value))
    .map((code) => ({
      value: code.value,
      label: code.value,
    }));
};

export const tooltipsSlice = createSlice({
  name: tooltips,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTooltips.fulfilled, (state, { payload }) => {
        state.tooltips = payload;
        state.notCreatedTooltips = [
          ...(getNotCreatedTooltips(payload) as Tooltips),
        ];
      })
      .addCase(createTooltip.fulfilled, (state, { payload }) => {
        const tooltips = [...state.tooltips, payload];
        state.tooltips = tooltips;
        state.notCreatedTooltips = [
          ...(getNotCreatedTooltips(tooltips) as Tooltips),
        ];
      })
      .addCase(updateTooltip.fulfilled, (state, { payload }) => {
        const updatedId = state.tooltips.findIndex(
          (tooltip) => tooltip.id === payload.id,
        );
        state.tooltips.splice(updatedId, 1, payload);
        state.notCreatedTooltips = [
          ...(getNotCreatedTooltips(state.tooltips) as Tooltips),
        ];
      })
      .addCase(removeTooltip.fulfilled, (state, { payload }) => {
        const deletedId = state.tooltips.findIndex(
          (tooltip) => tooltip.id === payload,
        );
        state.tooltips.splice(deletedId, 1);
        state.notCreatedTooltips = [
          ...(getNotCreatedTooltips(state.tooltips) as Tooltips),
        ];
      });
  },
});

export default tooltipsSlice.reducer;
