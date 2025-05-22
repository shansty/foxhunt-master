import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getHelpContents,
  createHelpContentTopic,
  updateHelpContentTopic,
  createHelpContentArticle,
  updateHelpContentArticle,
} from 'src/store/actions/helpContentActions';
import { ENTITY as helpContent } from 'src/store/actions/types/helpContentTypes';
import type { HelpContentSliceState } from './types';

const initialState: HelpContentSliceState = {
  helpContents: [],
};

export const helpContentSlice = createSlice({
  name: helpContent,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHelpContents.fulfilled, (state, { payload }) => {
        state.helpContents = payload;
      })
      .addCase(createHelpContentTopic.fulfilled, (state, { payload }) => {
        const createdTopic = payload;
        return {
          ...state,
          helpContents: [...state.helpContents, createdTopic],
        };
      })
      .addMatcher(
        isAnyOf(
          createHelpContentArticle.fulfilled,
          updateHelpContentTopic.fulfilled,
          updateHelpContentArticle.fulfilled,
        ),
        (state, { payload }) => {
          const updatedTopic = payload;
          state.helpContents[updatedTopic - 1] = updatedTopic;
          return {
            ...state,
            helpContents: state.helpContents.map((topic) =>
              topic.index === updatedTopic.index ? updatedTopic : topic,
            ),
          };
        },
      );
  },
});

export default helpContentSlice.reducer;
