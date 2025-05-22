import { combineReducers } from 'redux';
import userReducer from './userReducer';
import organizationReducer from './organizationReducer';
import themeOptionsReducer from './themeOptionsReducer';
import authReducer from './authReducer';
import userInvitationReducer from './userInvitationReducer';
import allUsersReducer from './allUsersReducer';
import paginationReducer from './paginationReducer';
import notificationReducer from './notificationReducer';
import userFeedbackReducer from './userFeedbackReducer';
import roleReducer from './roleReducer';
import featureReducer from './featureReducer';
import featureOrganizationReducer from './featureOrganizationReducer';
import packageReducer from './packageReducer';
import { AppState } from '../../types/States';

export default combineReducers<AppState>({
  userReducer,
  organizationReducer,
  themeOptionsReducer,
  authReducer,
  userInvitationReducer,
  allUsersReducer,
  paginationReducer,
  notificationReducer,
  userFeedbackReducer,
  roleReducer,
  featureReducer,
  featureOrganizationReducer,
  packageReducer,
});
