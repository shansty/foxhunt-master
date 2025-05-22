export const mainLayoutStateSelector = (state) => state.themeOptionsReducer;

export const selectSidebarFixed = (state) =>
  state.themeOptionsReducer.sidebarFixed;

export const selectSidebarToggleMobile = (state) =>
  state.themeOptionsReducer.sidebarToggleMobile;

export const selectHeaderFixed = (state) =>
  state.themeOptionsReducer.headerFixed;

export const selectHeaderShadow = (state) =>
  state.themeOptionsReducer.headerShadow;

export const selectFooterFixed = (state) =>
  state.themeOptionsReducer.footerFixed;
