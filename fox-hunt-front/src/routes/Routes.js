import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  buildDomainUrl,
  buildSignUpUrl,
  buildLoginUrl,
  buildResetPasswordUrl,
  buildSignInUrl,
  buildTokenInvalidUrl,
  buildDeclineInvitationUrl,
} from 'src/api/utils/navigationUtil';
import * as pages from 'src/pages';
import InnerAppRoutes from 'src/routes/InnerAppRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={buildDomainUrl()} element={<pages.DomainPage />} />
      <Route path={buildSignInUrl()} element={<pages.SignInPage />} />
      <Route path={buildSignUpUrl()} element={<pages.SignUpPage />} />
      <Route
        path={buildDeclineInvitationUrl()}
        element={<pages.DeclineInvitationPage />}
      />
      <Route
        path={buildTokenInvalidUrl()}
        element={<pages.TokenInvalidPage />}
      />
      <Route
        path={buildResetPasswordUrl()}
        element={<pages.ResetPasswordPage />}
      />
      <Route path={buildLoginUrl()} element={<pages.OAuthLoginPage />} />
      <Route path="/*" element={<InnerAppRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
