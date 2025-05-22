import { PackageAction } from '../../types/Actions';
import { PackageState } from '../../types/States';
import { PackageActionTypes } from '../actions/types/packageActionTypes';

const initialState: PackageState = {
  packages: [],
  organizationPackages: [],
  isLoading: true,
  error: null,
};

export default function packageReducer(
  state = initialState,
  action: PackageAction,
): PackageState {
  switch (action.type) {
    case PackageActionTypes.fetchOrganizationPackages.request:
    case PackageActionTypes.fetchPackages.request:
    case PackageActionTypes.update.request:
      return {
        ...state,
        isLoading: true,
      };
    case PackageActionTypes.update.success:
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case PackageActionTypes.fetchPackages.failure:
    case PackageActionTypes.fetchOrganizationPackages.failure:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case PackageActionTypes.fetchPackages.success:
      return {
        ...state,
        packages: action.payload,
        error: null,
      };
    case PackageActionTypes.fetchOrganizationPackages.success:
      return {
        ...state,
        organizationPackages: action.payload.map((el: any) => {
          el.packages = el.packages
            ? new Map(el.packages.map(({ id }: any) => [id, true]))
            : new Map();
          return el;
        }),
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
