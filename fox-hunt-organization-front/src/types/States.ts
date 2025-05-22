import { Feature } from './Feature';
import { Invitation } from './Invitation';
import { Notification } from './Notification';
import { Organization } from './Organization';
import { OrganizationPackage, Package } from './Packages';
import { User } from './RootUser';
import { FeatureOrganization } from './FeatureOrganization';
import { User as OneUser } from './AllUsers';

export interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  error: null | string;
}

export interface NotificationState {
  notifications: Notification[];
}

export interface OrganizationState {
  trainers?: any;
  isLoading: boolean;
  organizations: Organization[];
  error: null | string;
  organization?: Organization;
}

export interface FeatureState {
  isLoading: boolean;
  features?: Feature[];
  error: null | string;
}

export interface PackageState {
  isLoading: boolean;
  packages?: Package[];
  organizationPackages?: OrganizationPackage[];
  error: null | string;
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
  emptyRows: number;
  allItems: any[];
}

export interface RoleState {
  roles: any[];
  isLoading: boolean;
  error: null | string;
}

export interface featureOrganizationState {
  featureOrganizations?: FeatureOrganization[];
  isLoading: boolean;
  error: null | string;
}

export interface DeprecatedThemeOptionsState {
  sidebarFixed: boolean;
  sidebarToggleMobile: boolean;
  headerFixed: boolean;
  headerShadow: boolean;
  footerFixed: boolean;
}

export interface UserFeedbackState {
  userFeedbacks: Map<any, any>;
  userFeedbackAllSize: Map<any, any>;
  isLoading: boolean;
  error: any;
}

export interface UserInvitationState {
  isLoading: boolean;
  error: null | string;
  userInvitations: Invitation[];
}
export interface AllUsersState {
  isLoading: boolean;
  error: null | string;
  allUsers: OneUser[];
}

export interface UserState {
  isLoading: boolean;
  error: null | string;
  users: User[];
  organizationUsers: User[];
}

export interface initialState {
  authReducer?: {
    isSignedIn: boolean;
    error: string | null;
  };
}

export interface AppState {
  authReducer: AuthState;
  notificationReducer: NotificationState;
  organizationReducer: OrganizationState;
  featureReducer: FeatureState;
  userReducer: UserState;
  themeOptionsReducer: DeprecatedThemeOptionsState;
  userInvitationReducer: UserInvitationState;
  paginationReducer: PaginationState;
  userFeedbackReducer: UserFeedbackState;
  featureOrganizationReducer: featureOrganizationState;
  roleReducer: RoleState;
  packageReducer: PackageState;
  allUsersReducer: AllUsersState;
}
