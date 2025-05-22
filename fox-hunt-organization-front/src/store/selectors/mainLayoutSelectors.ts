import { createSelector } from 'reselect';
import { AppState } from '../../types/States';

export const mainLayoutStateSelector = (state: AppState) =>
  state.themeOptionsReducer;

export const selectSidebarFixed = createSelector(
  mainLayoutStateSelector,
  (state) => state.sidebarFixed,
);

export const selectSidebarToggleMobile = createSelector(
  mainLayoutStateSelector,
  (state) => state.sidebarToggleMobile,
);

export const selectHeaderFixed = createSelector(
  mainLayoutStateSelector,
  (state) => state.headerFixed,
);

export const selectHeaderShadow = createSelector(
  mainLayoutStateSelector,
  (state) => state.headerShadow,
);

export const selectFooterFixed = createSelector(
  mainLayoutStateSelector,
  (state) => state.footerFixed,
);
