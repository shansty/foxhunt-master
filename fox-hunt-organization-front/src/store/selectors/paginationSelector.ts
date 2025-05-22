import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const paginationStateSelector = (state: AppState) =>
  state.paginationReducer;

export const selectPageSize = createSelector(
  paginationStateSelector,
  (state) => state.pageSize,
);

export const selectPageNumber = createSelector(
  paginationStateSelector,
  (state) => state.pageNumber,
);

export const selectEmptyRows = createSelector(
  paginationStateSelector,
  (state) => state.emptyRows,
);
