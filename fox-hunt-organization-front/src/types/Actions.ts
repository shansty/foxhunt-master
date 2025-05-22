import { Notification } from './Notification';

export interface Action<Payload> {
  type: string;
  payload: Payload;
  meta?: boolean;
}

export interface NotificationAction
  extends Action<{
    key: string | number;
    notification: Notification;
    dismissAll: boolean;
  }> {}

export interface OrganizationAction extends Action<any> {}

export interface FeatureAction extends Action<any> {}

export interface FeatureOrganizationAction extends Action<any> {}

export interface PackageAction extends Action<any> {}

export interface PaginationAction
  extends Action<{
    pageNumber: number;
    pageSize: number;
    emptyRows: number;
    allItems: any[];
  }> {}

export interface DeprecatedThemeOptionsAction extends Action<any> {
  sidebarToggleMobile: boolean;
}

export interface AuthAction
  extends Action<{
    token: string;
  }> {}

export interface UserFeedbackAction
  extends Action<{
    userFeedbacks: Map<any, any>;
    organizationId: number;
    size: number;
  }> {}

export interface UserAction extends Action<any> {}

export interface UserInvitationAction extends Action<any> {}
export interface AllUsersAction extends Action<any> {}
