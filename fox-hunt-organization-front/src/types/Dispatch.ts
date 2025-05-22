import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  AuthAction,
  FeatureAction,
  FeatureOrganizationAction,
  NotificationAction,
  OrganizationAction,
  PackageAction,
  PaginationAction,
  UserAction,
  UserFeedbackAction,
  UserInvitationAction,
} from './Actions';
import {
  AuthState,
  featureOrganizationState,
  FeatureState,
  NotificationState,
  OrganizationState,
  PackageState,
  PaginationState,
  UserFeedbackState,
  UserInvitationState,
  UserState,
} from './States';

export type AppDispatch<S, A> = ThunkDispatch<S, void, Action<A>>;

export type NotificationDispatch = AppDispatch<
  NotificationState,
  NotificationAction
>;

export type UserFeedbackDispatch = AppDispatch<
  UserFeedbackState,
  UserFeedbackAction
>;

export type OrganizationDispatch = AppDispatch<
  UserFeedbackState,
  OrganizationAction | string
>;

export type FeatureDispatch = AppDispatch<FeatureState, FeatureAction | string>;

export type FeatureOrganizationDispatch = AppDispatch<
  featureOrganizationState,
  FeatureOrganizationAction
>;
export type PackageDispatch = AppDispatch<PackageState, PackageAction | string>;

export type UserDispatch = AppDispatch<UserState, UserAction>;

export type UserInvitationDispatch = AppDispatch<
  UserInvitationState,
  UserInvitationAction | string
>;

export type AuthDispatch = AppDispatch<AuthState, AuthAction | string>;

export type PaginationDispatch = AppDispatch<
  PaginationState,
  PaginationAction | string
>;
