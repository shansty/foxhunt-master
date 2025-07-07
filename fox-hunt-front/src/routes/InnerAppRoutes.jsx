import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { InnerApp } from 'src/InnerApp';
import ConditionalRoute from 'src/components/ConditionalRoute';
import {
  buildNotFoundUrl,
  buildCompetitionInvitationsUrl,
  buildCompetitionUrl,
  buildCreateLocationPackageUrl,
  buildCreateLocationUrl,
  buildCreateTimeAndLocationCompetitionUrl,
  buildHelpContentUrl,
  buildLaunchOneCompetitionUrl,
  buildLocationPackageUrl,
  buildLocationUrl,
  buildOneCompetitionReplayUrl,
  buildProfileUrl,
  buildUpdateLocationPackageUrl,
  buildUpdateLocationUrl,
  buildUpdateSettingsCompetition,
  buildUpdateTimeAndLocationCompetitionUrl,
  buildUserUrl,
  buildWatchOneCompetitionUrl,
  buildTooltipsUrl,
  buildUpdateProfileUrl,
  buildOrganizationSwitchUrl,
  buildCompetitionTemplateUrl,
  buildWelcomePageUrl,
} from 'src/api/utils/navigationUtil';
import {
  COMPETITION_TEMPLATE_MANAGEMENT,
  HELP_CONTENT_MANAGEMENT,
  LOCATION_MANAGEMENT,
  LOCATION_PACKAGE_MANAGEMENT,
  TOOLTIP_MANAGEMENT,
} from 'src/featureToggles/featureNameConstants';
import * as pages from 'src/pages';

const InnerAppRoutes = () => {
  return (
    <Routes>
      <Route element={<InnerApp />}>
        <Route path={buildWelcomePageUrl()} element={<pages.WelcomePage />} />
        <Route
          path={buildOrganizationSwitchUrl()}
          element={<pages.OrganizationSwitchPage />}
        />
        <Route
          path={buildLocationUrl()}
          element={<pages.ListLocationsPage />}
        />
        <Route
          path={buildCompetitionUrl()}
          element={<pages.ListCompetitionsPage />}
        />
        <Route
          path={buildCreateTimeAndLocationCompetitionUrl()}
          element={<pages.CreateCompetitionTimeAndLocationPage />}
        />
        <Route
          path={buildUpdateTimeAndLocationCompetitionUrl()}
          element={<pages.CreateCompetitionTimeAndLocationPage />}
        />
        <Route
          path={buildUpdateSettingsCompetition()}
          element={<pages.CompetitionSettingsPage />}
        />
        <Route
          path={buildLaunchOneCompetitionUrl()}
          element={<pages.LaunchCompetitionPage />}
        />
        <Route
          path={buildWatchOneCompetitionUrl()}
          element={<pages.WatchCompetitionPage />}
        />
        <Route
          path={buildOneCompetitionReplayUrl()}
          element={<pages.ReplayCompetitionPage />}
        />
        <Route
          path={buildCompetitionInvitationsUrl()}
          element={<pages.ListCompetitionInvitationsPage />}
        />
        <Route path={buildUserUrl()} element={<pages.ListUsersPage />} />
        <Route path={buildProfileUrl()} element={<pages.UserProfilePage />} />
        <Route
          path={buildUpdateProfileUrl()}
          element={<pages.UserProfilePage />}
        />
        <Route
          path={buildUpdateProfileUrl()}
          element={<pages.UserProfilePage />}
        />
        <Route
          path={buildCreateLocationUrl()}
          element={
            <ConditionalRoute
              element={<pages.CreateLocationMapPage />}
              toggledFeature={LOCATION_MANAGEMENT}
            />
          }
        />
        <Route
          path={buildUpdateLocationPackageUrl()}
          element={
            <ConditionalRoute
              element={<pages.CreateLocationPackageMapPage />}
              toggledFeature={LOCATION_PACKAGE_MANAGEMENT}
            />
          }
        />
        <Route
          path={buildLocationPackageUrl()}
          element={
            <ConditionalRoute
              element={<pages.ListLocationPackagesPage />}
              toggledFeature={LOCATION_PACKAGE_MANAGEMENT}
            />
          }
        />
        <Route>
          <Route
            path={buildCreateLocationPackageUrl()}
            element={
              <ConditionalRoute
                element={<pages.CreateLocationPackageMapPage />}
                toggledFeature={LOCATION_PACKAGE_MANAGEMENT}
              />
            }
          />
          <Route
            path={buildUpdateLocationUrl()}
            element={
              <ConditionalRoute
                element={<pages.CreateLocationMapPage />}
                toggledFeature={LOCATION_MANAGEMENT}
              />
            }
          />
        </Route>
        <Route
          path={buildCompetitionTemplateUrl()}
          element={
            <ConditionalRoute
              element={<pages.CompetitionTemplatePage />}
              toggledFeature={COMPETITION_TEMPLATE_MANAGEMENT}
            />
          }
        />
        <Route
          path={buildTooltipsUrl()}
          element={
            <ConditionalRoute
              element={<pages.ListTooltipsPage />}
              toggledFeature={TOOLTIP_MANAGEMENT}
            />
          }
        />
        <Route
          path={buildHelpContentUrl()}
          element={
            <ConditionalRoute
              element={<pages.HelpContentManagementPage />}
              toggledFeature={HELP_CONTENT_MANAGEMENT}
            />
          }
        />
        <Route path={buildNotFoundUrl()} element={<pages.NotFoundPage />} />
        <Route path="*" element={<pages.NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default InnerAppRoutes;
