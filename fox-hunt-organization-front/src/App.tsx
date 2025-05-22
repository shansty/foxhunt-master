import './theme/assets/base.scss';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ViewOrganizationsPage from './container/ViewOrganizationsPage/ViewOrganizationsPage';
import NewOrganizationPage from './container/NewOrganizationPage/NewOrganizationPage';
import MainLayout from './container/MainLayout/MainLayout';
import NewUserPage from './container/NewUserPage/NewUserPage';
import UserListPage from './container/UserListPage/UserListPage';
import LoginPage from './container/LoginPage/LoginPage';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectIsSignedIn } from './store/selectors/authSelector';
import NotFoundPage from './container/NotFoundPage/NotFoundPage';
import ViewInvitationsPage from './container/ViewInvitationsPage/ViewInvitationsPage';
import FeatureManagmentPage from './container/FeatureManagmentPage/FeatureManagmentPage';
import FeatureAssignmentPage from './container/FeatureAssignmentPage/FeatureAssignmentPage';
import Notifier from './Notifier';
import UserFeedbackPage from './container/UserFeedbackPage';
import PackageAssignmentPage from './container/PackageAssignmentPage/PackageAssignmentPage';
import {
  buildAllOrganizationsFeedbacksUrl,
  buildEditOrganizationUrl,
  buildFeatureAssignmentUrl,
  buildFeatureManagmentUrl,
  buildLoginUrl,
  buildNewOrganizationUrl,
  buildNewUserUrl,
  buildNotFoundUrl,
  buildOrganizationUrl,
  buildPackageAssignmentUrl,
  buildUserInvitationUrl,
  buildUsersUrl,
} from './utils/RoutingUtil';

interface AppProps {
  isSignedIn: boolean;
}

const App = (props: AppProps) => {
  const { isSignedIn } = props;
  return (
    <>
      <Notifier />
      <Routes>
        <Route
          path={buildLoginUrl()}
          element={!isSignedIn ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            isSignedIn ? (
              <MainLayout />
            ) : (
              <Navigate to={buildLoginUrl()} replace />
            )
          }
        >
          <Route
            path={buildOrganizationUrl()}
            element={<ViewOrganizationsPage />}
          />
          <Route
            path={buildNewOrganizationUrl()}
            element={<NewOrganizationPage />}
          />
          <Route
            path={buildEditOrganizationUrl()}
            element={<NewOrganizationPage />}
          />
          <Route path={buildNewUserUrl()} element={<NewUserPage />} />
          <Route
            path={buildFeatureManagmentUrl()}
            element={<FeatureManagmentPage />}
          />
          <Route
            path={buildFeatureAssignmentUrl()}
            element={<FeatureAssignmentPage />}
          />
          <Route
            path={buildPackageAssignmentUrl()}
            element={<PackageAssignmentPage />}
          />
          <Route
            path={buildUserInvitationUrl()}
            element={<ViewInvitationsPage />}
          />
          <Route
            path={buildAllOrganizationsFeedbacksUrl()}
            element={<UserFeedbackPage />}
          />
          <Route path={buildUsersUrl()} element={<UserListPage />} />
        </Route>
        <Route path={buildNotFoundUrl()} element={<NotFoundPage />} />

        <Route
          path="*"
          element={<Navigate to={buildNotFoundUrl()} replace />}
        />
      </Routes>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  isSignedIn: selectIsSignedIn,
});

export default connect(mapStateToProps)(App);
