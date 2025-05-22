import React from 'react';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';

function WelcomePage() {
  return <MainLayout></MainLayout>;
}

export default signInRequired(WelcomePage);
