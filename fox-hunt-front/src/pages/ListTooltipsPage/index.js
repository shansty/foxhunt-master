import React from 'react';
import ListTooltips from 'src/containers/ListTooltipsContainer/ListTooltips/ListTooltips';
import MainLayout from 'src/layouts/MainLayout';
import { PageTitle } from 'common-front';
import { signInRequired } from 'src/hocs/permissions';

const TITLE = 'Tooltips management';
const DESCRIPTION =
  'Create, update and remove Tooltips for mobile application.';

function ListTooltipsPage() {
  return (
    <MainLayout>
      <PageTitle titleHeading={TITLE} titleDescription={DESCRIPTION} />
      <ListTooltips />
    </MainLayout>
  );
}

export default signInRequired(ListTooltipsPage);
