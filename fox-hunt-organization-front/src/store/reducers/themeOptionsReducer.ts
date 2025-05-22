import { DeprecatedThemeOptionsAction } from '../../types/Actions';
import { DeprecatedThemeOptionsState } from '../../types/States';

const initialState: DeprecatedThemeOptionsState = {
  sidebarFixed: true,
  sidebarToggleMobile: false,
  headerFixed: true,
  headerShadow: true,
  footerFixed: false,
};

export const SET_SIDEBAR_TOGGLE_MOBILE =
  'THEME_OPTIONS/SET_SIDEBAR_TOGGLE_MOBILE';

export const setSidebarToggleMobile = (sidebarToggleMobile: boolean) => ({
  type: SET_SIDEBAR_TOGGLE_MOBILE,
  sidebarToggleMobile,
});

export default function themeOptionsReducer(
  state = initialState,
  action: DeprecatedThemeOptionsAction,
): DeprecatedThemeOptionsState {
  switch (action.type) {
    case SET_SIDEBAR_TOGGLE_MOBILE:
      return {
        ...state,
        sidebarToggleMobile: action.sidebarToggleMobile,
      };
    default:
      break;
  }
  return state;
}
